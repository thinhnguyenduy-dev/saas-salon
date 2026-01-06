import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking, BookingSchema } from '../schemas/booking.schema';
import { Staff, StaffSchema } from '../schemas/staff.schema';
import { Service, ServiceSchema } from '../schemas/service.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
        { name: Booking.name, schema: BookingSchema },
        { name: Staff.name, schema: StaffSchema },
        { name: Service.name, schema: ServiceSchema }
    ]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
