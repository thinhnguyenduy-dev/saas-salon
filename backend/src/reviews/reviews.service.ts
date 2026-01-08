import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { User } from '../entities/user.entity';
import { Customer } from '../entities/customer.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto) {
    // Find customer by userId
    const customer = await this.customerRepository.findOne({
      where: { id: userId }
    });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    // Check if booking exists if provided
    if (createReviewDto.bookingId) {
      // TODO: Verify booking belongs to customer and is completed
      // For now, we'll mark as verified if bookingId is provided
    }

    const review = this.reviewRepository.create({
      ...createReviewDto,
      customerId: customer.id,
      isVerified: !!createReviewDto.bookingId,
    });

    return this.reviewRepository.save(review);
  }

  async findByShop(
    shopId: string,
    options: { page: number; limit: number; rating?: number }
  ) {
    const { page = 1, limit = 10, rating } = options;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.customer', 'customer')
      .where('review.shopId = :shopId', { shopId })
      .orderBy('review.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating });
    }

    const [reviews, total] = await queryBuilder.getManyAndCount();

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByUser(userId: string) {
    // Find customer by userId
    const customer = await this.customerRepository.findOne({
      where: { id: userId }
    });

    if (!customer) {
      return [];
    }

    return this.reviewRepository.find({
      where: { customerId: customer.id },
      relations: ['shop'],
      order: { createdAt: 'DESC' },
    });
  }

  async addResponse(reviewId: string, userId: string, response: string) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['shop'],
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Check if user owns the shop
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['shop'],
    });

    if (!user || !user.shop || user.shop.id !== review.shopId) {
      throw new ForbiddenException('You can only respond to reviews for your own shop');
    }

    review.response = response;
    review.responseDate = new Date();

    return this.reviewRepository.save(review);
  }

  async delete(reviewId: string, userId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Find customer by userId
    const customer = await this.customerRepository.findOne({
      where: { id: userId }
    });

    if (!customer || review.customerId !== customer.id) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewRepository.remove(review);
    return { message: 'Review deleted successfully' };
  }

  async getShopStats(shopId: string) {
    const reviews = await this.reviewRepository.find({
      where: { shopId },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }

    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / reviews.length;

    const distribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return {
      averageRating: Math.round(average * 10) / 10,
      totalReviews: reviews.length,
      distribution,
    };
  }
}
