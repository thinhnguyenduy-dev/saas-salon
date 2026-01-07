import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Shop } from '../entities/shop.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { Service } from '../entities/service.entity';
import { Staff } from '../entities/staff.entity';
import { Customer } from '../entities/customer.entity';
import { Booking, BookingStatus } from '../entities/booking.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5433'),
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'pass',
    database: process.env.DB_DATABASE || 'salonpro',
    entities: [
      User,
      Shop,
      ServiceCategory,
      Service,
      Staff,
      Customer,
      Booking
    ],
    synchronize: true,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected for seeding...');

    // Clear existing data
    console.log('Clearing old data...');
    await dataSource.query('TRUNCATE TABLE "shops" CASCADE'); 

    // 1. Create Main Shop
    const shopRepo = dataSource.getRepository(Shop);
    console.log('Creating Main Shop...');
    const shop = shopRepo.create({
      name: 'Beautiful Salon',
      slug: 'beautiful-salon',
      businessHours: [{
        day: 'Monday-Sunday',
        open: '08:00',
        close: '22:00',
      }],
      isActive: true,
      street: '123 Main St',
      city: 'Metropolis',
      district: 'Central District'
    });
    await shopRepo.save(shop);

    // 2. Create Owner
    const userRepo = dataSource.getRepository(User);
    console.log('Creating Owner Account...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const owner = userRepo.create({
      fullName: 'Admin Owner',
      email: 'admin@example.com',
      password: hashedPassword,
      shop: shop,
      shopId: shop.id,
      role: UserRole.OWNER,
      isActive: true,
    });
    await userRepo.save(owner);

    // 3. Create Service Categories
    console.log('Creating Service Categories...');
    const categoryRepo = dataSource.getRepository(ServiceCategory);
    
    const massageCategory = categoryRepo.create({
      name: 'Massage',
      shopId: shop.id,
      description: 'Relaxing massage services'
    });
    await categoryRepo.save(massageCategory);

    const facialCategory = categoryRepo.create({
      name: 'Facial',
      shopId: shop.id,
      description: 'Facial and skincare treatments'
    });
    await categoryRepo.save(facialCategory);

    const hairCategory = categoryRepo.create({
      name: 'Hair',
      shopId: shop.id,
      description: 'Hair styling and treatments'
    });
    await categoryRepo.save(hairCategory);

    // 4. Create Services
    console.log('Creating Services...');
    const serviceRepo = dataSource.getRepository(Service);
    
    const services = [
      {
        name: 'Traditional Balinese Massage',
        description: 'Relaxing full body massage',
        price: 80.00,
        duration: 60,
        categoryId: massageCategory.id,
      },
      {
        name: 'Hot Stone Massage',
        description: 'Therapeutic hot stone treatment',
        price: 95.00,
        duration: 75,
        categoryId: massageCategory.id,
      },
      {
        name: 'Aromatherapy Massage',
        description: 'Massage with essential oils',
        price: 85.00,
        duration: 60,
        categoryId: massageCategory.id,
      },
      {
        name: 'Deep Tissue Massage',
        description: 'Intensive muscle therapy',
        price: 90.00,
        duration: 60,
        categoryId: massageCategory.id,
      },
      {
        name: 'Facial Treatment',
        description: 'Rejuvenating facial care',
        price: 70.00,
        duration: 45,
        categoryId: facialCategory.id,
      },
      {
        name: 'Swedish Massage',
        description: 'Classic relaxation massage',
        price: 75.00,
        duration: 60,
        categoryId: massageCategory.id,
      },
      {
        name: 'Thai Massage',
        description: 'Traditional Thai stretching massage',
        price: 85.00,
        duration: 90,
        categoryId: massageCategory.id,
      },
      {
        name: 'Haircut & Style',
        description: 'Professional haircut and styling',
        price: 45.00,
        duration: 45,
        categoryId: hairCategory.id,
      },
    ];

    const createdServices = [];
    for (const svc of services) {
      const service = serviceRepo.create({
        ...svc,
        shopId: shop.id,
        isActive: true
      });
      const saved = await serviceRepo.save(service);
      createdServices.push(saved);
    }

    // 5. Create Staff Members
    console.log('Creating Staff Members...');
    const staffRepo = dataSource.getRepository(Staff);
    
    const staffMembers = [
      {
        fullName: 'Sarah Johnson',
        email: 'sarah@beautiful-salon.com',
        phone: '+1-555-0101',
        skills: ['Traditional Balinese Massage', 'Hot Stone Massage', 'Aromatherapy'],
        baseSalary: 3000,
        commissionRate: 15,
      },
      {
        fullName: 'Michael Chen',
        email: 'michael@beautiful-salon.com',
        phone: '+1-555-0102',
        skills: ['Deep Tissue Massage', 'Swedish Massage', 'Sports Massage'],
        baseSalary: 3200,
        commissionRate: 15,
      },
      {
        fullName: 'Emily Rodriguez',
        email: 'emily@beautiful-salon.com',
        phone: '+1-555-0103',
        skills: ['Facial Treatment', 'Skincare', 'Aromatherapy'],
        baseSalary: 2800,
        commissionRate: 12,
      },
      {
        fullName: 'David Kim',
        email: 'david@beautiful-salon.com',
        phone: '+1-555-0104',
        skills: ['Thai Massage', 'Deep Tissue', 'Hot Stone'],
        baseSalary: 3100,
        commissionRate: 15,
      },
      {
        fullName: 'Jessica Martinez',
        email: 'jessica@beautiful-salon.com',
        phone: '+1-555-0105',
        skills: ['Haircut', 'Styling', 'Color Treatment'],
        baseSalary: 2900,
        commissionRate: 18,
      },
    ];

    const createdStaff = [];
    for (const staffData of staffMembers) {
      const staff = staffRepo.create({
        ...staffData,
        shopId: shop.id,
        isActive: true,
        workSchedule: [
          { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' }, // Monday
          { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' }, // Tuesday
          { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' }, // Wednesday
          { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' }, // Thursday
          { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' }, // Friday
          { dayOfWeek: 6, startTime: '10:00', endTime: '16:00' }, // Saturday
        ]
      });
      const saved = await staffRepo.save(staff);
      createdStaff.push(saved);
    }

    // 6. Create Customers
    console.log('Creating Customers...');
    const customerRepo = dataSource.getRepository(Customer);
    
    const customers = [
      { fullName: 'Alice Cooper', email: 'alice@example.com', phone: '+1-555-1001' },
      { fullName: 'Bob Williams', email: 'bob@example.com', phone: '+1-555-1002' },
      { fullName: 'Carol Davis', email: 'carol@example.com', phone: '+1-555-1003' },
      { fullName: 'Daniel Brown', email: 'daniel@example.com', phone: '+1-555-1004' },
      { fullName: 'Emma Wilson', email: 'emma@example.com', phone: '+1-555-1005' },
      { fullName: 'Frank Miller', email: 'frank@example.com', phone: '+1-555-1006' },
      { fullName: 'Grace Lee', email: 'grace@example.com', phone: '+1-555-1007' },
      { fullName: 'Henry Taylor', email: 'henry@example.com', phone: '+1-555-1008' },
      { fullName: 'Iris Anderson', email: 'iris@example.com', phone: '+1-555-1009' },
      { fullName: 'Jack Thomas', email: 'jack@example.com', phone: '+1-555-1010' },
    ];

    const createdCustomers = [];
    for (const custData of customers) {
      const customer = customerRepo.create({
        ...custData,
        shopId: shop.id,
      });
      const saved = await customerRepo.save(customer);
      createdCustomers.push(saved);
    }

    // 7. Create Bookings for Calendar Testing
    console.log('Creating Test Bookings...');
    const bookingRepo = dataSource.getRepository(Booking);
    
    // Helper function to generate booking code
    const generateBookingCode = () => {
      return 'BK' + Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // Helper to get date string
    const getDateString = (daysOffset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + daysOffset);
      return date.toISOString().split('T')[0];
    };

    // Helper to calculate end time
    const calculateEndTime = (startTime: string, duration: number) => {
      const [hours, minutes] = startTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + duration;
      const endHours = Math.floor(totalMinutes / 60);
      const endMinutes = totalMinutes % 60;
      return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    };

    // Create bookings for this week and next week
    const bookingsData = [
      // Today
      { date: 0, startTime: '09:00', staffIdx: 0, customerIdx: 0, serviceIdx: 0, status: BookingStatus.CONFIRMED, notes: 'Customer prefers medium pressure' },
      { date: 0, startTime: '10:30', staffIdx: 1, customerIdx: 1, serviceIdx: 3, status: BookingStatus.CONFIRMED, notes: 'Focus on lower back' },
      { date: 0, startTime: '14:00', staffIdx: 2, customerIdx: 2, serviceIdx: 4, status: BookingStatus.PENDING, notes: 'First time customer' },
      { date: 0, startTime: '16:00', staffIdx: 3, customerIdx: 3, serviceIdx: 6, status: BookingStatus.CONFIRMED },
      
      // Tomorrow
      { date: 1, startTime: '09:00', staffIdx: 0, customerIdx: 4, serviceIdx: 1, status: BookingStatus.CONFIRMED, notes: 'Allergic to lavender oil' },
      { date: 1, startTime: '11:00', staffIdx: 1, customerIdx: 5, serviceIdx: 5, status: BookingStatus.CONFIRMED },
      { date: 1, startTime: '13:00', staffIdx: 2, customerIdx: 6, serviceIdx: 4, status: BookingStatus.PENDING },
      { date: 1, startTime: '15:00', staffIdx: 4, customerIdx: 7, serviceIdx: 7, status: BookingStatus.CONFIRMED, notes: 'Trim only, no styling' },
      { date: 1, startTime: '17:00', staffIdx: 3, customerIdx: 8, serviceIdx: 2, status: BookingStatus.PENDING },
      
      // Day after tomorrow
      { date: 2, startTime: '10:00', staffIdx: 0, customerIdx: 9, serviceIdx: 0, status: BookingStatus.CONFIRMED },
      { date: 2, startTime: '12:00', staffIdx: 1, customerIdx: 0, serviceIdx: 3, status: BookingStatus.CONFIRMED },
      { date: 2, startTime: '14:00', staffIdx: 2, customerIdx: 1, serviceIdx: 4, status: BookingStatus.PENDING },
      { date: 2, startTime: '16:00', staffIdx: 3, customerIdx: 2, serviceIdx: 6, status: BookingStatus.CONFIRMED },
      
      // 3 days from now
      { date: 3, startTime: '09:30', staffIdx: 4, customerIdx: 3, serviceIdx: 7, status: BookingStatus.CONFIRMED },
      { date: 3, startTime: '11:00', staffIdx: 0, customerIdx: 4, serviceIdx: 2, status: BookingStatus.CONFIRMED, notes: 'Regular customer, knows preferences' },
      { date: 3, startTime: '13:30', staffIdx: 1, customerIdx: 5, serviceIdx: 5, status: BookingStatus.PENDING },
      { date: 3, startTime: '15:00', staffIdx: 2, customerIdx: 6, serviceIdx: 4, status: BookingStatus.CONFIRMED },
      
      // 4 days from now
      { date: 4, startTime: '10:00', staffIdx: 3, customerIdx: 7, serviceIdx: 6, status: BookingStatus.CONFIRMED },
      { date: 4, startTime: '12:30', staffIdx: 0, customerIdx: 8, serviceIdx: 1, status: BookingStatus.PENDING },
      { date: 4, startTime: '14:00', staffIdx: 1, customerIdx: 9, serviceIdx: 3, status: BookingStatus.CONFIRMED },
      { date: 4, startTime: '16:00', staffIdx: 4, customerIdx: 0, serviceIdx: 7, status: BookingStatus.CONFIRMED },
      
      // Next week Monday
      { date: 7, startTime: '09:00', staffIdx: 0, customerIdx: 1, serviceIdx: 0, status: BookingStatus.CONFIRMED },
      { date: 7, startTime: '11:00', staffIdx: 1, customerIdx: 2, serviceIdx: 5, status: BookingStatus.PENDING },
      { date: 7, startTime: '13:00', staffIdx: 2, customerIdx: 3, serviceIdx: 4, status: BookingStatus.CONFIRMED },
      { date: 7, startTime: '15:00', staffIdx: 3, customerIdx: 4, serviceIdx: 6, status: BookingStatus.CONFIRMED },
      { date: 7, startTime: '17:00', staffIdx: 4, customerIdx: 5, serviceIdx: 7, status: BookingStatus.PENDING },
      
      // Past bookings (for history)
      { date: -1, startTime: '10:00', staffIdx: 0, customerIdx: 6, serviceIdx: 0, status: BookingStatus.COMPLETED },
      { date: -1, startTime: '14:00', staffIdx: 1, customerIdx: 7, serviceIdx: 3, status: BookingStatus.COMPLETED },
      { date: -2, startTime: '11:00', staffIdx: 2, customerIdx: 8, serviceIdx: 4, status: BookingStatus.COMPLETED },
      { date: -2, startTime: '15:00', staffIdx: 3, customerIdx: 9, serviceIdx: 6, status: BookingStatus.NO_SHOW },
      { date: -3, startTime: '09:00', staffIdx: 4, customerIdx: 0, serviceIdx: 7, status: BookingStatus.CANCELLED },
    ];

    for (const bookingData of bookingsData) {
      const service = createdServices[bookingData.serviceIdx];
      const staff = createdStaff[bookingData.staffIdx];
      const customer = createdCustomers[bookingData.customerIdx];
      
      const endTime = calculateEndTime(bookingData.startTime, service.duration);
      
      const booking = bookingRepo.create({
        bookingCode: generateBookingCode(),
        shopId: shop.id,
        customerId: customer.id,
        staffId: staff.id,
        appointmentDate: getDateString(bookingData.date),
        startTime: bookingData.startTime,
        endTime: endTime,
        totalDuration: service.duration,
        totalPrice: service.price,
        status: bookingData.status,
        notes: bookingData.notes || undefined,
        services: [service],
      });
      
      await bookingRepo.save(booking);
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Shop: Beautiful Salon`);
    console.log(`   - Owner: admin@example.com / password123`);
    console.log(`   - Staff Members: ${createdStaff.length}`);
    console.log(`   - Customers: ${createdCustomers.length}`);
    console.log(`   - Services: ${createdServices.length}`);
    console.log(`   - Bookings: ${bookingsData.length}`);
    console.log('\n🗓️  Bookings created for:');
    console.log(`   - Past: 3 bookings (completed/cancelled/no-show)`);
    console.log(`   - Today: 4 bookings`);
    console.log(`   - This week: 17 bookings`);
    console.log(`   - Next week: 5 bookings`);
    console.log('\n🎯 Login and visit /dashboard/bookings to see the calendar!');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
