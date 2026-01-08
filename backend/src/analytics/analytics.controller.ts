import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  getStats(@Request() req: any) {
    return this.analyticsService.getStats(req.user);
  }

  @Get('dashboard-overview')
  getDashboardOverview(@Request() req: any) {
    return this.analyticsService.getDashboardOverview(req.user);
  }

  @Get('revenue')
  getRevenue(@Request() req: any, @Query('days') days: number) {
    return this.analyticsService.getRevenueOverTime(req.user, days || 7);
  }
}
