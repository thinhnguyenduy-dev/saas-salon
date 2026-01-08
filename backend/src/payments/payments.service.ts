import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
      @InjectRepository(Shop) private shopRepository: Repository<Shop>,
      private notificationsService: NotificationsService,
      private usersService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16' as any, // Using standard version or whatever is latest
    });
  }

  // ... createPaymentIntent logs ...

  async createPaymentIntent(amount: number, currency: string, metadata: any) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), 
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        client_secret: paymentIntent.client_secret,
        id: paymentIntent.id
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      console.log('Webhook received. Signature present:', !!signature, 'Secret present:', !!endpointSecret);
      let event;

      try {
          if (endpointSecret) {
               event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
          } else {
               event = JSON.parse(payload.toString());
               console.warn('Webhook signature verification skipped (No Secret)');
          }
      } catch (err: any) {
          console.error(`Webhook Error: ${err.message}`);
          throw new BadRequestException(`Webhook Error: ${err.message}`);
      }
      
      console.log('Webhook Event Type:', event.type);

      switch (event.type) {
          case 'checkout.session.completed':
              const session = event.data.object;
              console.log('Processing checkout.session.completed. Mode:', session.mode, 'Metadata:', session.metadata);
              if (session.mode === 'subscription' && session.metadata?.shopId) {
                  await this.handleSubscriptionCheckout(session);
              } else {
                  console.log('Skipping subscription update: Not subscription mode or missing shopId');
              }
              break;
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
              const subscription = event.data.object;
              await this.handleSubscriptionUpdate(subscription);
              break;
      }

      return { received: true };
  }

  private async handleSubscriptionCheckout(session: any) {
      const shopId = session.metadata.shopId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      console.log(`Updating Shop ${shopId} to PRO. Customer: ${customerId}, Sub: ${subscriptionId}`);

      await this.shopRepository.update(
          { id: shopId },
          { 
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionPlan: 'PRO', 
              subscriptionStatus: 'active'
          }
      );
      console.log(`Shop ${shopId} updated successfully.`);
      
      // Notify Shop Owner
      const shopOwner = await this.usersService.findOneByShopId(shopId);
      if (shopOwner) {
          await this.notificationsService.createAndSend(
              shopOwner.id,
              'Subscription Upgraded',
              'Your shop has been successfully upgraded to the PRO plan!',
              'success' as any
          );
      }
  }

  private async handleSubscriptionUpdate(subscription: any) {
      // Find shop by stripeSubscriptionId
      const shop = await this.shopRepository.findOneBy({ stripeSubscriptionId: subscription.id });
      if (shop) {
          shop.subscriptionStatus = subscription.status;
          
          if (subscription.status !== 'active' && subscription.status !== 'trialing') {
               // Notify Shop Owner of potential issue
               const shopOwner = await this.usersService.findOneByShopId(shop.id);
               if (shopOwner) {
                   await this.notificationsService.createAndSend(
                       shopOwner.id,
                       'Subscription Alert',
                       `Your subscription status is now: ${subscription.status}. Please check your billing settings.`,
                       'warning' as any
                   );
               }
          }
          await this.shopRepository.save(shop);
      }
  }
}
