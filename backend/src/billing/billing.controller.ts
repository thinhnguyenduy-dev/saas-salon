import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User, UserRole } from '../entities/user.entity';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  getPlans() {
      return this.billingService.getPlans();
  }

  @Post('checkout')
  async createCheckout(@CurrentUser() user: User, @Body() body: { priceId: string }) {
      console.log('Starting checkout for priceId:', body.priceId);
      // Typically only OWNER can upgrade
      return this.billingService.createCheckoutSession(user.shopId, user, body.priceId);
  }

  @Post('portal')
  async createPortal(@CurrentUser() user: User) {
      return this.billingService.createPortalSession(user.shopId);
  }
}
