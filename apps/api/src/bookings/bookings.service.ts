import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginateModel } from '../common/plugins/paginate.plugin';
import { Booking, BookingDocument, BookingStatus } from '../schemas/booking.schema';
import { Staff, StaffDocument } from '../schemas/staff.schema';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: PaginateModel<BookingDocument>,
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
    @InjectModel(Service.name) private serviceModel: Model<ServiceDocument>,
  ) {}

  async create(createBookingDto: CreateBookingDto, user: User) {
    const { services, staffId, appointmentDate, startTime } = createBookingDto;

    // 1. Calculate duration and price
    const serviceDocs = await this.serviceModel.find({ _id: { $in: services } });
    if (serviceDocs.length !== services.length) {
      throw new BadRequestException('One or more services not found');
    }

    const totalDuration = serviceDocs.reduce((acc, s) => acc + s.duration, 0);
    const totalPrice = serviceDocs.reduce((acc, s) => acc + s.price, 0);

    // Calculate End Time
    const [startHour, startMin] = startTime.split(':').map(Number);
    const startDate = new Date(appointmentDate);
    startDate.setHours(startHour, startMin, 0, 0);
    
    const endDate = new Date(startDate.getTime() + totalDuration * 60000);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    // 2. Check Availability (Simplified for now, assumes staffId is provided or picks first available)
    // TODO: Robust availability logic with "Any Staff" option
    if (staffId) {
        const isAvailable = await this.checkStaffAvailability(staffId, appointmentDate, startTime, endTime);
        if (!isAvailable) {
            throw new BadRequestException('Staff is not available at this time');
        }
    } else {
        // Auto-assign staff logic would go here
        throw new BadRequestException('Staff selection is required for now');
    }

    // 3. Create Booking
    const booking = new this.bookingModel({
      ...createBookingDto,
      shopId: user.shopId,
      totalDuration,
      totalPrice,
      endTime,
      status: BookingStatus.CONFIRMED, // Auto-confirm for now
    });

    return booking.save();
  }

  async checkStaffAvailability(staffId: string, date: string, startTime: string, endTime: string): Promise<boolean> {
      // Check for existing bookings overlapping
      // Overlap logic: (StartA < EndB) and (EndA > StartB)
      
      const count = await this.bookingModel.countDocuments({
          staffId,
          appointmentDate: new Date(date), // Assuming exact date match handling
          status: { $nin: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW] }, // Ignore cancelled
          $or: [
              { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
          ]
      });

      return count === 0;
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, date, status } = query;
    const filter: any = { shopId: user.shopId };

    if (date) {
        // Simple equal check, might need range for real apps
        filter.appointmentDate = new Date(date);
    }

    if (status) {
        filter.status = status;
    }

    return this.bookingModel.paginate(filter, {
      page,
      limit,
      sort: { appointmentDate: 1, startTime: 1 },
      populate: ['customerId', 'staffId', 'services'],
    });
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, user: User) {
    const booking = await this.bookingModel.findOneAndUpdate(
      { _id: id, shopId: user.shopId },
      updateBookingDto,
      { new: true },
    );
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

    async remove(id: string, user: User) {
    const booking = await this.bookingModel.findOneAndUpdate(
      { _id: id, shopId: user.shopId },
      { status: BookingStatus.CANCELLED },
      { new: true },
    );
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
