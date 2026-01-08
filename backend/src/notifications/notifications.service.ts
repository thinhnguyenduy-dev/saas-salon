import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notifications') private notificationsQueue: Queue,
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  // Save to DB and emit via WebSocket
  async createAndSend(userId: string, title: string, message: string, type: NotificationType = NotificationType.INFO, link?: string) {
    const notification = this.notificationRepo.create({
      userId,
      title,
      message,
      type,
      link,
    });
    const saved = await this.notificationRepo.save(notification);
    
    // Emit real-time event
    this.notificationsGateway.sendNotificationToUser(userId, 'notification', saved);
    
    return saved;
  }

  async findAll(userId: string) {
    return this.notificationRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50, // Limit to last 50
    });
  }

  async markAsRead(userId: string, notificationId: string) {
    await this.notificationRepo.update({ id: notificationId, userId }, { isRead: true });
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.update({ userId, isRead: false }, { isRead: true });
    return { success: true };
  }

  async sendBookingConfirmation(email: string, bookingDetails: any) {
    // Determine userId from bookingDetails if possible, or pass it in. 
    // For now assuming we just want email, but in future we should also add in-app notification.
    
    await this.notificationsQueue.add('send-email', {
        to: email,
        subject: 'Booking Confirmation',
        template: 'booking-confirmation',
        context: bookingDetails
    });
    this.logger.log(`Queued confirmation email for ${email}`);
  }

  async sendBookingCancellation(email: string, bookingDetails: any) {
    await this.notificationsQueue.add('send-email', {
        to: email,
        subject: 'Booking Cancelled',
        template: 'booking-cancellation',
        context: bookingDetails
    });
    this.logger.log(`Queued cancellation email for ${email}`);
  }
}
