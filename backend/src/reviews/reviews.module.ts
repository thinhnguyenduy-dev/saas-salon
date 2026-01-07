import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from '../entities/review.entity';
import { Shop } from '../entities/shop.entity';
import { Customer } from '../entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Shop, Customer])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
