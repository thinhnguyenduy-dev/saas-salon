import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';
import { User } from '../entities/user.entity';
import Stripe from 'stripe';

@Injectable()
export class BillingService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Shop) private shopRepository: Repository<Shop>,
  ) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
          apiVersion: '2025-12-15.clover' as any,
      });
  }

  getPlans() {
      return [
          {
              id: 'free',
              name: 'Free',
              price: 0,
              features: ['Basic Features', 'Online Booking'],
              priceId: null
          },
          {
              id: 'pro',
              name: 'Pro',
              price: 29,
              features: ['Basic Features', 'Online Booking', 'Advanced Analytics', 'Unlimited Staff', 'Priority Support'],
              priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_placeholder'
          }
      ];
  }

  async createCheckoutSession(shopId: string, user: User, priceId: string) {
      const shop = await this.shopRepository.findOneBy({ id: shopId });
      if (!shop) throw new BadRequestException('Shop not found');

      let customerId = shop.stripeCustomerId;

      // Create Stripe Customer if not exists
      if (!customerId) {
          const customer = await this.stripe.customers.create({
              email: user.email,
              name: user.fullName || shop.name,
              metadata: {
                  shopId: shop.id
              }
          });
          customerId = customer.id;
          
          shop.stripeCustomerId = customerId;
          await this.shopRepository.save(shop);
      }

      try {
          const session = await this.stripe.checkout.sessions.create({
              customer: customerId,
              mode: 'subscription',
              payment_method_types: ['card'],
              line_items: [
                  {
                      price: priceId,
                      quantity: 1,
                  }
              ],
              metadata: {
                  shopId: shop.id,
              },
              success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/billing?success=true`,
              cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/billing?canceled=true`,
          });

          return { url: session.url };
      } catch (error) {
          console.error("Stripe Session Error", error);
          throw new InternalServerErrorException("Failed to create checkout session");
      }
  }

  async createPortalSession(shopId: string) {
      const shop = await this.shopRepository.findOneBy({ id: shopId });
      if (!shop || !shop.stripeCustomerId) throw new BadRequestException('Shop or Stripe Customer not found');

      const session = await this.stripe.billingPortal.sessions.create({
          customer: shop.stripeCustomerId,
          return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/billing`,
      });

      return { url: session.url };
  }
}
