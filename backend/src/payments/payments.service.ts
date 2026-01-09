import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';
import { Booking, PaymentStatus, BookingStatus } from '../entities/booking.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
      @InjectRepository(Shop) private shopRepository: Repository<Shop>,
      @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
      private notificationsService: NotificationsService,
      private usersService: UsersService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16' as any, // Using standard version or whatever is latest
    });
  }

  // ... createPaymentIntent logs ...

  async createBookingPaymentIntent(bookingId: string, amount: number, shopId: string, customerId: string) {
      try {
          const paymentIntent = await this.stripe.paymentIntents.create({
              amount: Math.round(amount * 100),
              currency: 'usd', // Default to USD for now, strictly should come from config/shop settings
              metadata: {
                  type: 'booking_payment',
                  bookingId,
                  shopId,
                  customerId
              },
              automatic_payment_methods: {
                  enabled: true,
              },
          });

          return {
              client_secret: paymentIntent.client_secret,
              id: paymentIntent.id
          };
      } catch (error) {
          console.error('Error creating booking payment intent:', error);
          throw new InternalServerErrorException('Failed to create payment intent');
      }
  }

  async handleWebhook(signature: string, payload: Buffer) {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      let event;

      try {
          if (endpointSecret) {
               event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
          } else {
               event = JSON.parse(payload.toString());
          }
      } catch (err: any) {
          throw new BadRequestException(`Webhook Error: ${err.message}`);
      }
      
      console.log('Webhook Event Type:', event.type);

      switch (event.type) {
          case 'payment_intent.succeeded':
              await this.handlePaymentIntentSucceeded(event.data.object);
              break;
          case 'checkout.session.completed':
              const session = event.data.object;
              // ... existing subscription logic ...
              if (session.mode === 'subscription' && session.metadata?.shopId) {
                  await this.handleSubscriptionCheckout(session);
              }
              break;
          // ... existing subscription updates ...
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':
              await this.handleSubscriptionUpdate(event.data.object);
              break;
      }

      return { received: true };
  }

  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
      const { bookingId, type } = paymentIntent.metadata;
      
      if (type === 'booking_payment' && bookingId) {
          console.log(`Processing successful payment for Booking ${bookingId}`);
          
          await this.bookingRepository.update(
              { id: bookingId },
              { 
                  paymentStatus: PaymentStatus.PAID, 
                  stripePaymentIntentId: paymentIntent.id,
                  status: BookingStatus.CONFIRMED 
              }
          );
          
          // Optionally notify customer using notificationsService (already handled in bookings creation? 
          // No, creation happens before payment now. Payment confirms it.)
          // We should send "Payment Receipt" or "Confirmed" email here if creation sent "Pending" email.
      }
  }

  // ... existing methods ...
  private async handleSubscriptionCheckout(session: any) {
      // ... same as before
      const shopId = session.metadata.shopId;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      await this.shopRepository.update(
          { id: shopId },
          { 
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionPlan: 'PRO', 
              subscriptionStatus: 'active'
          }
      );
      
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
       // ... same as before
      const shop = await this.shopRepository.findOneBy({ stripeSubscriptionId: subscription.id });
      if (shop) {
          shop.subscriptionStatus = subscription.status;
          await this.shopRepository.save(shop);
      }
  }
}
