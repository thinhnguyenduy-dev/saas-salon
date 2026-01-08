import { Controller, Post, Body, Headers, BadRequestException, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('create-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency: string; metadata: any }) {
    if (!body.amount) {
        throw new BadRequestException('Amount is required');
    }
    return this.paymentsService.createPaymentIntent(body.amount, body.currency || 'usd', body.metadata);
  }

  @Public()
  @Post('webhook')
  async handleWebhook(@Headers('stripe-signature') signature: string, @Req() req: any) {
     // req.rawBody is attached by the json middleware in AppModule
     if (!req.rawBody) {
         throw new BadRequestException('Raw body not found. Ensure middleware is configured.');
     }
     return this.paymentsService.handleWebhook(signature, req.rawBody);
  }
}
