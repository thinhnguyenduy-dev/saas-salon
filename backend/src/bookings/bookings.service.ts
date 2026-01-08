import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, LessThan, MoreThan, Not, Between } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Staff } from '../entities/staff.entity';
import { Service } from '../entities/service.entity';
import { Customer } from '../entities/customer.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreatePublicBookingDto } from './dto/create-public-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { User, UserRole } from '../entities/user.entity';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  async createPublic(createDto: CreatePublicBookingDto) {
    const { services, staffId, appointmentDate, startTime, guestName, guestEmail, guestPhone, shopId } = createDto;

    // 1. Create User (Account)
    let user = guestEmail ? await this.usersService.findOneByEmail(guestEmail) : null;
    if (!user) {
        user = await this.usersService.create({
            fullName: guestName,
            email: guestEmail || `guest_${Date.now()}@example.com`,
            phone: guestPhone,
            role: UserRole.CUSTOMER,
            password: Math.random().toString(36),
            shopId: shopId as string
        });
    }

    // 2. Find/Create Customer (CRM)
    let customer = await this.customerRepository.findOne({
        where: { shopId, phone: guestPhone }
    });

    if (!customer) {
        customer = this.customerRepository.create({
            shopId,
            fullName: guestName,
            phone: guestPhone,
            email: guestEmail,
            userId: user.id // Link Account
        });
        customer = await this.customerRepository.save(customer);
    }

    // 3. Resolve Services
    const serviceEntities = await this.serviceRepository.findBy({ id: In(services) });
    if (serviceEntities.length !== services.length) throw new BadRequestException('Services not found');

    const totalDuration = serviceEntities.reduce((acc, s) => acc + s.duration, 0);
    const totalPrice = serviceEntities.reduce((acc, s) => Number(acc) + Number(s.price), 0);

    const [startHour, startMin] = startTime.split(':').map(Number);
    const startDate = new Date(appointmentDate);
    startDate.setHours(startHour, startMin, 0, 0);
    const endDate = new Date(startDate.getTime() + totalDuration * 60000);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    if (staffId) {
        const isAvailable = await this.checkStaffAvailability(staffId, appointmentDate, startTime, endTime);
        if (!isAvailable) throw new BadRequestException('Staff not available');
    }

    const booking = this.bookingRepository.create({
      shopId,
      customerId: customer.id,
      staffId: staffId || null,
      services: serviceEntities,
      appointmentDate,
      startTime,
      endTime,
      totalDuration,
      totalPrice,
      status: BookingStatus.CONFIRMED,
    });

    const savedBooking = await this.bookingRepository.save(booking);
    
    // Notifications
    
    // 1. Notify Customer (Email)
    if (customer.email) {
        this.notificationsService.sendBookingConfirmation(customer.email, {
            bookingId: savedBooking.id,
            bookingCode: savedBooking.bookingCode,
            date: savedBooking.appointmentDate,
            time: savedBooking.startTime,
            shopName: 'Our Shop' // Should fetch shop
        });
    }

    // 2. Notify Shop Owner (Dashboard Notification)
    // Find shop owner
    const shopOwner = await this.usersService.findOneByShopId(shopId);
    if (shopOwner) {
        await this.notificationsService.createAndSend(
            shopOwner.id,
            'New Public Booking',
            `New booking from ${customer.fullName} for ${appointmentDate} at ${startTime}`,
            'success' as any
        );
    }
    
    // Stray code removed

    return savedBooking;
  }

  async create(createBookingDto: CreateBookingDto, user: User) {
    const { services, staffId, appointmentDate, startTime, customerId } = createBookingDto;

    const serviceEntities = await this.serviceRepository.findBy({ id: In(services) });
    if (serviceEntities.length !== services.length) {
      throw new BadRequestException('One or more services not found');
    }

    const totalDuration = serviceEntities.reduce((acc, s) => acc + s.duration, 0);
    const totalPrice = serviceEntities.reduce((acc, s) => Number(acc) + Number(s.price), 0);

    const [startHour, startMin] = startTime.split(':').map(Number);
    const startDate = new Date(appointmentDate);
    startDate.setHours(startHour, startMin, 0, 0);
    
    const endDate = new Date(startDate.getTime() + totalDuration * 60000);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    if (staffId) {
        const isAvailable = await this.checkStaffAvailability(staffId, appointmentDate, startTime, endTime);
        if (!isAvailable) {
            throw new BadRequestException('Staff is not available at this time');
        }
    } else {
        throw new BadRequestException('Staff selection is required for now');
    }

    const booking = this.bookingRepository.create({
      shopId: user.shopId,
      customerId: customerId,
      staffId: staffId || null,
      services: serviceEntities,
      appointmentDate,
      startTime,
      endTime,
      totalDuration,
      totalPrice,
      status: BookingStatus.CONFIRMED,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Notify Shop Owner (Confirmation)
    await this.notificationsService.createAndSend(
        user.id,
        'Booking Created',
        `You created a booking for ${customerId} on ${appointmentDate}`,
        'info' as any
    );

    return savedBooking;
  }

  async checkStaffAvailability(staffId: string, date: string, startTime: string, endTime: string): Promise<boolean> {
      const qb = this.bookingRepository.createQueryBuilder('booking');
      qb.where('booking.staffId = :staffId', { staffId });
      qb.andWhere('booking.appointmentDate = :date', { date });
      qb.andWhere('booking.status NOT IN (:...statuses)', { statuses: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW] });
      qb.andWhere('booking.startTime < :endTime', { endTime });
      qb.andWhere('booking.endTime > :startTime', { startTime });

      const count = await qb.getCount();
      return count === 0;
  }

  async getMyBookings(user: User) {
      // Find all customers linked to this user
      const customers = await this.customerRepository.find({ where: { userId: user.id } });
      const customerIds = customers.map(c => c.id);

      if (customerIds.length === 0) return [];

      return this.bookingRepository.find({
          where: { customerId: In(customerIds) },
          relations: ['shop', 'services', 'staff'],
          order: { appointmentDate: 'DESC', startTime: 'DESC' }
      });
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 50, date, startDate, endDate, status } = query;
    const qb = this.bookingRepository.createQueryBuilder('booking');
    qb.where('booking.shopId = :shopId', { shopId: user.shopId });

    if (date) {
        qb.andWhere('booking.appointmentDate = :date', { date });
    }
    
    if (startDate && endDate) {
        qb.andWhere('booking.appointmentDate >= :startDate AND booking.appointmentDate <= :endDate', { startDate, endDate });
    }

    if (status) {
        qb.andWhere('booking.status = :status', { status });
    }

    qb.orderBy('booking.appointmentDate', 'ASC');
    qb.addOrderBy('booking.startTime', 'ASC');
    
    qb.leftJoinAndSelect('booking.customer', 'customer');
    qb.leftJoinAndSelect('booking.staff', 'staff');
    qb.leftJoinAndSelect('booking.services', 'services');

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      docs: items,
      totalDocs: total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateBookingDto: UpdateBookingDto, user: User) {
    const booking = await this.bookingRepository.findOne({ where: { id, shopId: user.shopId }, relations: ['services'] });
    if (!booking) throw new NotFoundException('Booking not found');

    const { services, ...rest } = updateBookingDto;

    // Merge basic fields
    Object.assign(booking, rest);

    // Update services if provided
    if (services) {
        const serviceEntities = await this.serviceRepository.findBy({ id: In(services) });
        if (serviceEntities.length !== services.length) throw new BadRequestException('Services not found');
        booking.services = serviceEntities;
        
        // Recalculate duration/price if services changed
        booking.totalDuration = serviceEntities.reduce((acc, s) => acc + s.duration, 0);
        booking.totalPrice = serviceEntities.reduce((acc, s) => Number(acc) + Number(s.price), 0);
        // And EndTime... (Simplified for now, assumming proper logic handles this or UI sends new end time if they change services)
        // But backend should probably recalculate.
    }

    return this.bookingRepository.save(booking);
  }

  async remove(id: string, user: User) {
    const booking = await this.bookingRepository.findOne({ where: { id, shopId: user.shopId }, relations: ['customer'] });
    if (!booking) throw new NotFoundException('Booking not found');

    await this.bookingRepository.update(
      { id, shopId: user.shopId },
      { status: BookingStatus.CANCELLED },
    );

    if (booking.customer && booking.customer.email) {
        this.notificationsService.sendBookingCancellation(booking.customer.email, {
             bookingId: booking.id,
             date: booking.appointmentDate,
             shopName: 'My Shop'
        });
    }

    // Notify Shop Owner
    await this.notificationsService.createAndSend(
        user.id,
        'Booking Cancelled',
        `Booking for ${booking.customer?.fullName || 'Customer'} on ${booking.appointmentDate} has been cancelled.`,
        'warning' as any
    );

    return { message: 'Booking cancelled' };
  }



  async getAvailableSlots(query: any) {
    try {
        const { shopId, serviceIds, staffId, date } = query;
        // console.log("getAvailableSlots query:", query);
        
        let services: string[] = [];
        if (Array.isArray(serviceIds)) {
            services = serviceIds;
        } else if (typeof serviceIds === 'string') {
            services = serviceIds.split(',').map(s => s.trim()).filter(Boolean);
        }

        if (services.length === 0) return [];
        
        // 1. Get total duration
        const serviceEntities = await this.serviceRepository.findBy({ id: In(services) });
        const totalDuration = serviceEntities.reduce((acc, s) => acc + s.duration, 0);

        // 2. Determine Staff
        let staffList: Staff[] = [];
        if (staffId) {
            const staff = await this.staffRepository.findOneBy({ id: staffId });
            if (staff) staffList.push(staff);
        } else {
            staffList = await this.staffRepository.findBy({ shopId, isActive: true });
        }

        if (staffList.length === 0) return [];

        const targetDate = new Date(date);
        const dayOfWeek = targetDate.getDay();

        const allSlots = new Set<string>();

        for (const staff of staffList) {
            const schedule = Array.isArray(staff.workSchedule) ? staff.workSchedule : [];
            const shift = schedule.find((s: any) => s.dayOfWeek === dayOfWeek);
            
            if (!shift || !shift.startTime || !shift.endTime) continue;

            // FIX: Use date logic consistent with DB
            // We need to fetch bookings for that day.
            // Since appointmentDate is timestamptz, we should range query for the whole day.
            const startOfDay = new Date(date);
            startOfDay.setHours(0,0,0,0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23,59,59,999);

            const qb = this.bookingRepository.createQueryBuilder('booking');
            qb.where('booking.staffId = :staffId', { staffId: staff.id });
            // Fix: Use range for date comparison to handle timestamptz correctly
            qb.andWhere('booking.appointmentDate >= :startOfDay AND booking.appointmentDate <= :endOfDay', { startOfDay, endOfDay });
            qb.andWhere('booking.status NOT IN (:...statuses)', { statuses: [BookingStatus.CANCELLED, BookingStatus.NO_SHOW] });

            const bookings = await qb.getMany();

            const [startH, startM] = shift.startTime.split(':').map(Number);
            const [endH, endM] = shift.endTime.split(':').map(Number);
            
            let currentH = startH;
            let currentM = startM;

            while (currentH < endH || (currentH === endH && currentM < endM)) {
                const timeString = `${currentH.toString().padStart(2, '0')}:${currentM.toString().padStart(2, '0')}`;
                
                const slotStartMins = currentH * 60 + currentM;
                const slotEndMins = slotStartMins + totalDuration;
                const shiftEndMins = endH * 60 + endM;

                if (slotEndMins <= shiftEndMins) {
                    const slotEndTimeString = `${Math.floor(slotEndMins / 60).toString().padStart(2, '0')}:${(slotEndMins % 60).toString().padStart(2, '0')}`;
                    
                    const isConflict = bookings.some(b => {
                        const bStart = b.startTime;
                        const bEnd = b.endTime;
                        return (timeString < bEnd && slotEndTimeString > bStart);
                    });

                    if (!isConflict) {
                        allSlots.add(timeString);
                    }
                }

                currentM += 30;
                if (currentM >= 60) {
                    currentH++;
                    currentM -= 60;
                }
            }
        }

        return Array.from(allSlots).sort();
    } catch (error) {
        console.error("Error in getAvailableSlots:", error);
        throw new BadRequestException("Failed to fetch slots");
    }
}
}
