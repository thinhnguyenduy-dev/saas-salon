import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
  ) {}

  async create(data: { shopId: string; customerId?: string; serviceId?: string; rating: number; comment?: string }) {
      const review = this.reviewRepository.create(data);
      return this.reviewRepository.save(review);
  }

  async findAllByShop(shopId: string) {
      return this.reviewRepository.find({
          where: { shopId },
          relations: ['customer'], // show who reviewed
          order: { createdAt: 'DESC' }
      });
  }
}
