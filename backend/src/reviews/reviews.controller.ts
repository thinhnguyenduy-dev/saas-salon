import { 
  Controller, 
  Post, 
  Get, 
  Put,
  Delete,
  Body, 
  Param, 
  Query,
  UseGuards,
  Request,
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { RespondReviewDto } from './dto/respond-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Request() req: any, @Body() createReviewDto: CreateReviewDto) {
    const userId = req.user.userId;
    return this.reviewsService.create(userId, createReviewDto);
  }

  @Get('shop/:shopId')
  async findAllByShop(
    @Param('shopId') shopId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('rating') rating?: number,
  ) {
    return this.reviewsService.findByShop(shopId, { page, limit, rating });
  }

  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  async findMyReviews(@Request() req: any) {
    const userId = req.user.userId;
    return this.reviewsService.findByUser(userId);
  }

  @Put(':id/response')
  @UseGuards(JwtAuthGuard)
  async addResponse(
    @Request() req: any,
    @Param('id') reviewId: string,
    @Body() respondReviewDto: RespondReviewDto,
  ) {
    const userId = req.user.userId;
    return this.reviewsService.addResponse(reviewId, userId, respondReviewDto.response);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Request() req: any, @Param('id') reviewId: string) {
    const userId = req.user.userId;
    return this.reviewsService.delete(reviewId, userId);
  }

  @Get('shop/:shopId/stats')
  async getShopStats(@Param('shopId') shopId: string) {
    return this.reviewsService.getShopStats(shopId);
  }
}
