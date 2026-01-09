import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from '../entities/booking.entity';
import { Staff } from '../entities/staff.entity';
import { Service } from '../entities/service.entity';
import { Customer } from '../entities/customer.entity';
import { User } from '../entities/user.entity';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, Staff, Service, Customer, User]),
    UsersModule,
    NotificationsModule,
    PaymentsModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
