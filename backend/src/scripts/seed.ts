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
import { Review } from '../entities/review.entity';
import { faker } from '@faker-js/faker';

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
      Booking,
      Review
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
    
    // Helper function for standard business hours
    const getStandardBusinessHours = () => [
      { day: 'monday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'tuesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'wednesday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'thursday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'friday', isOpen: true, openTime: '09:00', closeTime: '18:00', breaks: [{ start: '12:00', end: '13:00' }] },
      { day: 'saturday', isOpen: true, openTime: '10:00', closeTime: '17:00', breaks: [] },
      { day: 'sunday', isOpen: false, openTime: null, closeTime: null, breaks: [] },
    ];
    
    const shop = shopRepo.create({
      name: 'Beautiful Salon',
      slug: 'beautiful-salon',
      businessHours: getStandardBusinessHours(),
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

    const createdBookings = [];

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
      createdBookings.push(booking);
    }
    
    // Create Reviews
    console.log('Creating Reviews...');
    const reviewRepository = dataSource.getRepository(Review);
    const reviews = [];
    
    // Add reviews for the main shop
    const mainShopBookings = createdBookings.filter(b => b.shopId === shop.id);
    const completedMainShopBookings = mainShopBookings.filter(b => b.status === BookingStatus.COMPLETED);
    
    for (const booking of completedMainShopBookings) {
      if (Math.random() > 0.3) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
        const review = reviewRepository.create({
          shopId: shop.id,
          customerId: booking.customerId,
          serviceId: booking.services[0]?.id,
          bookingId: booking.id,
          rating: rating,
          comment: rating === 5 
            ? 'Amazing service! I will definitely come back soon.' 
            : 'Great experience, very professional staff.',
          isVerified: true,
          createdAt: new Date(booking.startTime), 
        });
        
        if (Math.random() > 0.5) {
          review.response = 'Thank you so much for your kind words! We look forward to seeing you again.';
          review.responseDate = new Date(review.createdAt.getTime() + 24 * 60 * 60 * 1000); // 1 day later
        }
        
        reviews.push(review);
      }
    }

    await reviewRepository.save(reviews);
    console.log(`Created ${reviews.length} reviews for main shop`);

    // 8. Create 20 Additional Shops
    console.log('Creating 20 Additional Shops...');
    const additionalShops = [
      { name: 'Glamour Studio', slug: 'glamour-studio', city: 'Downtown', district: 'Fashion District', street: '456 Style Ave', image: '/images/shops/glamour-studio.png' },
      { name: 'Serenity Spa', slug: 'serenity-spa', city: 'Riverside', district: 'Wellness Quarter', street: '789 Calm Road', image: '/images/shops/serenity-spa.png' },
      { name: 'Elite Hair Lounge', slug: 'elite-hair-lounge', city: 'Uptown', district: 'Luxury Lane', street: '101 Prestige Blvd', image: '/images/shops/elite-hair-lounge.png' },
      { name: 'Radiant Beauty Bar', slug: 'radiant-beauty-bar', city: 'Midtown', district: 'Beauty Plaza', street: '202 Glow Street', image: '/images/shops/radiant-beauty-bar.png' },
      { name: 'Zen Wellness Center', slug: 'zen-wellness-center', city: 'Eastside', district: 'Tranquil Zone', street: '303 Peace Avenue', image: '/images/shops/zen-wellness-center.png' },
      { name: 'Luxe Nail Boutique', slug: 'luxe-nail-boutique', city: 'Westend', district: 'Chic Corner', street: '404 Polish Lane', image: '/images/shops/luxe-nail-boutique.png' },
      { name: 'Blissful Retreat', slug: 'blissful-retreat', city: 'Northgate', district: 'Relaxation Row', street: '505 Harmony Way', image: '/images/shops/serenity-spa.png' },
      { name: 'Modern Cuts Salon', slug: 'modern-cuts-salon', city: 'Southside', district: 'Trendy District', street: '606 Edge Street', image: '/images/shops/modern-cuts-salon.png' },
      { name: 'Velvet Touch Spa', slug: 'velvet-touch-spa', city: 'Central Park', district: 'Spa District', street: '707 Soft Avenue', image: '/images/shops/velvet-touch-spa.png' },
      { name: 'Crown Beauty Palace', slug: 'crown-beauty-palace', city: 'Royal Heights', district: 'Elite Quarter', street: '808 Regal Road', image: '/images/shops/radiant-beauty-bar.png' },
      { name: 'Fresh Face Studio', slug: 'fresh-face-studio', city: 'Green Valley', district: 'Natural Zone', street: '909 Pure Lane', image: '/images/shops/fresh-face-studio.png' },
      { name: 'Silk & Shine', slug: 'silk-and-shine', city: 'Pearl Bay', district: 'Coastal Area', street: '1010 Smooth Street', image: '/images/shops/glamour-studio.png' },
      { name: 'Urban Glow Lounge', slug: 'urban-glow-lounge', city: 'Metro Center', district: 'City Core', street: '1111 Bright Blvd', image: '/images/shops/urban-glow-lounge.png' },
      { name: 'Tranquil Oasis', slug: 'tranquil-oasis', city: 'Desert Springs', district: 'Calm District', street: '1212 Serene Way', image: '/images/shops/zen-wellness-center.png' },
      { name: 'Chic Boutique Salon', slug: 'chic-boutique-salon', city: 'Fashion Valley', district: 'Style Street', street: '1313 Vogue Avenue', image: '/images/shops/elite-hair-lounge.png' },
      { name: 'Paradise Spa Resort', slug: 'paradise-spa-resort', city: 'Tropical Bay', district: 'Resort Area', street: '1414 Island Road', image: '/images/shops/velvet-touch-spa.png' },
      { name: 'Platinum Hair Studio', slug: 'platinum-hair-studio', city: 'Silver Lake', district: 'Premium Zone', street: '1515 Shine Lane', image: '/images/shops/modern-cuts-salon.png' },
      { name: 'Blossom Beauty Haven', slug: 'blossom-beauty-haven', city: 'Garden City', district: 'Floral District', street: '1616 Petal Street', image: '/images/shops/fresh-face-studio.png' },
      { name: 'Infinity Wellness', slug: 'infinity-wellness', city: 'Horizon Hills', district: 'Health Quarter', street: '1717 Forever Avenue', image: '/images/shops/zen-wellness-center.png' },
      { name: 'Prestige Beauty Lounge', slug: 'prestige-beauty-lounge', city: 'Diamond District', district: 'Luxury Zone', street: '1818 Class Boulevard', image: '/images/shops/luxe-nail-boutique.png' },
    ];

    let shopCounter = 2;
    for (const shopData of additionalShops) {
      const newShop = shopRepo.create({
        name: shopData.name,
        slug: shopData.slug,
        businessHours: getStandardBusinessHours(),
        isActive: true,
        street: shopData.street,
        city: shopData.city,
        district: shopData.district,
        image: shopData.image
      });
      await shopRepo.save(newShop);

      // Create owner for each shop
      const shopOwner = userRepo.create({
        fullName: `${shopData.name} Owner`,
        email: `owner${shopCounter}@${shopData.slug}.com`,
        password: hashedPassword,
        shop: newShop,
        shopId: newShop.id,
        role: UserRole.OWNER,
        isActive: true,
      });
      await userRepo.save(shopOwner);

      // Create basic categories for each shop
      const shopCategories = [];
      const hairCat = categoryRepo.create({
        name: 'Hair Services',
        shopId: newShop.id,
        description: 'Professional hair care'
      });
      await categoryRepo.save(hairCat);
      shopCategories.push(hairCat);

      const nailCat = categoryRepo.create({
        name: 'Nail Services',
        shopId: newShop.id,
        description: 'Manicure and pedicure'
      });
      await categoryRepo.save(nailCat);
      shopCategories.push(nailCat);

      // Create basic services
      const basicServices = [
        { name: 'Haircut', price: 35.00, duration: 30, categoryId: hairCat.id },
        { name: 'Hair Coloring', price: 85.00, duration: 90, categoryId: hairCat.id },
        { name: 'Manicure', price: 25.00, duration: 30, categoryId: nailCat.id },
        { name: 'Pedicure', price: 35.00, duration: 45, categoryId: nailCat.id },
      ];

      for (const svcData of basicServices) {
        const svc = serviceRepo.create({
          ...svcData,
          shopId: newShop.id,
          isActive: true
        });
        await serviceRepo.save(svc);
      }

      // Create 2 staff members per shop
      const staffData = [
        {
          fullName: `Staff Member ${shopCounter}A`,
          email: `staff${shopCounter}a@${shopData.slug}.com`,
          phone: `+1-555-${2000 + shopCounter}`,
          skills: ['Haircut', 'Styling'],
          baseSalary: 2500,
          commissionRate: 15,
        },
        {
          fullName: `Staff Member ${shopCounter}B`,
          email: `staff${shopCounter}b@${shopData.slug}.com`,
          phone: `+1-555-${3000 + shopCounter}`,
          skills: ['Manicure', 'Pedicure'],
          baseSalary: 2300,
          commissionRate: 12,
        },
      ];

      for (const staffMember of staffData) {
        const staff = staffRepo.create({
          ...staffMember,
          shopId: newShop.id,
          isActive: true,
          workSchedule: [
            { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 3, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 4, startTime: '09:00', endTime: '17:00' },
            { dayOfWeek: 5, startTime: '09:00', endTime: '17:00' },
          ]
        });
        await staffRepo.save(staff);
      }

      // Create 3 customers per shop
      for (let i = 1; i <= 3; i++) {
        const customer = customerRepo.create({
          fullName: `Customer ${shopCounter}-${i}`,
          email: `customer${shopCounter}-${i}@example.com`,
          phone: `+1-555-${4000 + shopCounter * 10 + i}`,
          shopId: newShop.id,
        });
        await customerRepo.save(customer);
      }

      shopCounter++;
    }

    console.log('\n✅ Seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Total Shops: 21 (1 main + 20 additional)`);
    console.log(`   - Main Shop: Beautiful Salon`);
    console.log(`   - Main Owner: admin@example.com / password123`);
    console.log(`   - Staff Members (main shop): ${createdStaff.length}`);
    console.log(`   - Customers (main shop): ${createdCustomers.length}`);
    console.log(`   - Services (main shop): ${createdServices.length}`);
    console.log(`   - Bookings (main shop): ${bookingsData.length}`);
    console.log('\n🏪 Additional Shops:');
    console.log(`   - Each shop has: 2 staff, 3 customers, 4 services`);
    console.log(`   - Login format: owner2@glamour-studio.com, owner3@serenity-spa.com, etc.`);
    console.log(`   - Password for all: password123`);
    console.log('\n🗓️  Bookings created for main shop:');
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
