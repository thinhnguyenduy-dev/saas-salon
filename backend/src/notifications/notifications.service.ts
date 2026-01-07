import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(@InjectQueue('notifications') private notificationsQueue: Queue) {}

  async sendBookingConfirmation(email: string, bookingDetails: any) {
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
