import { Controller, Post, Body, Headers, Req, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency?: string; metadata?: any }) {
    return this.paymentsService.createPaymentIntent(body.amount, body.currency, body.metadata);
  }

  @Post('webhook')
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: any) {
    if (!signature) {
       throw new BadRequestException('Missing stripe-signature header');
    }
    // Note: In a real NestJS app, you need to ensure the raw body is available.
    // By default, body parsers consume the stream.
    // If 'raw-body' middleware is not set up, this might fail or require specific config.
    // We assume `req.rawBody` or similar is available or we fallback to `req.body` if it's already a buffer (unlikely with global json middleware).
    // For this implementation, we will try to use `req.rawBody` which is common in NestJS Stripe setups with `minio` or similar, 
    // OR we assume the global middleware configuration handles '/payments/webhook' differently.
    
    // Simplest fix for typical Nest setups:
    const body = req.rawBody || req.body; 
    return this.paymentsService.handleWebhook(signature, body);
  }
}

