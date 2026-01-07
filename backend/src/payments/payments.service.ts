import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Booking, PaymentStatus, BookingStatus } from '../entities/booking.entity';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
  ) {
    const apiKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!apiKey) {
      this.logger.warn('STRIPE_SECRET_KEY is not defined');
    }

    this.stripe = new Stripe(apiKey || 'sk_test_placeholder', {
      // @ts-ignore
      apiVersion: '2024-12-18.acacia',
      typescript: true,
    });
  }

  async createPaymentIntent(amount: number, currency: string = 'usd', metadata?: any) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      return paymentIntent;
    } catch (error) {
      this.logger.error('Stripe Error:', error);
      throw new InternalServerErrorException('Failed to create payment intent');
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook Error: ${err.message}`);
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      await this.handlePaymentSuccess(paymentIntent);
    }

    return { received: true };
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
     const { bookingId } = paymentIntent.metadata;
     
     if (!bookingId) {
         this.logger.warn(`Missing bookingId in paymentIntent metadata: ${paymentIntent.id}`);
         return;
     }

     const booking = await this.bookingRepository.findOneBy({ id: bookingId });
     if (!booking) {
         this.logger.error(`Booking not found for payment: ${bookingId}`);
         return;
     }

     booking.paymentStatus = PaymentStatus.PAID;
     booking.stripePaymentIntentId = paymentIntent.id;
     // Optionally confirm the booking if it was pending payment
     // booking.status = BookingStatus.CONFIRMED; 

     await this.bookingRepository.save(booking);
     this.logger.log(`Booking ${bookingId} payment successful. Status updated.`);
  }
}
