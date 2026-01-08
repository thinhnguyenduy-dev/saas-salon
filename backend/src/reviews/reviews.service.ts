import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}

  async create(data: { shopId: string; customerId?: string; serviceId?: string; rating: number; comment?: string }) {
      const review = this.reviewRepository.create(data);
      const savedReview = await this.reviewRepository.save(review);

      // Notify Shop Owner
      const shopOwner = await this.usersService.findOneByShopId(data.shopId);
      if (shopOwner) {
          await this.notificationsService.createAndSend(
              shopOwner.id,
              'New Review Received',
              `A customer left a ${data.rating}-star review: "${data.comment || 'No comment'}"`,
              'info' as any
          );
      }

      return savedReview;
  }

  async findAllByShop(shopId: string) {
      return this.reviewRepository.find({
          where: { shopId },
          relations: ['customer'], // show who reviewed
          order: { createdAt: 'DESC' }
      });
  }
}
