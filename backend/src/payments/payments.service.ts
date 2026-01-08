import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
      @InjectRepository(Shop) private shopRepository: Repository<Shop>
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2025-12-15.clover' as any,
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
  }

  private async handleSubscriptionUpdate(subscription: any) {
      // Find shop by stripeSubscriptionId
      const shop = await this.shopRepository.findOneBy({ stripeSubscriptionId: subscription.id });
      if (shop) {
          shop.subscriptionStatus = subscription.status;
          if (subscription.status !== 'active' && subscription.status !== 'trialing') {
              // Downgrade if inactive? Or keep PRO until end of period?
              // For safety, let's keep it PRO but mark status.
              // Logic can be refined later.
          }
          await this.shopRepository.save(shop);
      }
  }
}
