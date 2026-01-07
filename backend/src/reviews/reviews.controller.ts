import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() body: any) {
    return this.reviewsService.create(body);
  }

  @Get('shop/:shopId')
  findAllByShop(@Param('shopId') shopId: string) {
    return this.reviewsService.findAllByShop(shopId);
  }
}
