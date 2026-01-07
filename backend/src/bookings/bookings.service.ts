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

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    private usersService: UsersService,
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

    return this.bookingRepository.save(booking);
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

    return this.bookingRepository.save(booking);
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
    await this.bookingRepository.update(
      { id, shopId: user.shopId },
      { status: BookingStatus.CANCELLED },
    );
    return { message: 'Booking cancelled' };
  }

  async getAvailableSlots(query: any) {
    const { shopId, serviceIds, staffId, date } = query;
    const services = Array.isArray(serviceIds) ? serviceIds : [serviceIds];
    
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
        const shift = (staff.workSchedule as any[]).find((s: any) => s.dayOfWeek === dayOfWeek);
        if (!shift) continue;

        const qb = this.bookingRepository.createQueryBuilder('booking');
        qb.where('booking.staffId = :staffId', { staffId: staff.id });
        qb.andWhere('booking.appointmentDate = :date', { date });
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
  }
}
