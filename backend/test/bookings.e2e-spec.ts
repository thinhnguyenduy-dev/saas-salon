import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Shop } from './../src/entities/shop.entity';
import { Service } from './../src/entities/service.entity';
import { ServiceCategory } from './../src/entities/service-category.entity';
import { Booking } from './../src/entities/booking.entity';
import { User } from './../src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

describe('BookingsController (e2e)', () => {
  let app: INestApplication;
  let shopRepository: Repository<Shop>;
  let serviceRepository: Repository<Service>;
  let categoryRepository: Repository<ServiceCategory>;

  let testShop: Shop;
  let testCategory: ServiceCategory;
  let testService: Service;

  let bookingRepository: Repository<Booking>;
  let userRepository: Repository<User>;
  let createdBookingId: string;
  const guestEmail = 'e2e@example.com';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    shopRepository = app.get<Repository<Shop>>(getRepositoryToken(Shop));
    serviceRepository = app.get<Repository<Service>>(getRepositoryToken(Service));
    categoryRepository = app.get<Repository<ServiceCategory>>(getRepositoryToken(ServiceCategory));
    // Need to get Booking Repository - assuming it is exported or available via TypeORM
    // We can use dataSource.getRepository('Booking') or similar if Entity is available
    bookingRepository = app.get<DataSource>(DataSource).getRepository(Booking);
    userRepository = app.get<Repository<User>>(getRepositoryToken(User));

    // 1. Create Shop
    testShop = shopRepository.create({
      name: 'E2E Test Salon',
      slug: `e2e-test-salon-${Date.now()}`,
      street: '123 E2E St',
      city: 'Test City',
      district: 'Test District',
      isActive: true,
      subscriptionPlan: 'PRO',
      settings: {},
      businessHours: []
    });
    await shopRepository.save(testShop);

    // 2. Create Category
    testCategory = categoryRepository.create({
      name: 'E2E Category',
      shopId: testShop.id,
      shop: testShop // Ensure relation is set
    });
    await categoryRepository.save(testCategory);

    // 3. Create Service
    testService = serviceRepository.create({
      name: 'E2E Service',
      price: 100,
      duration: 60,
      shopId: testShop.id,
      categoryId: testCategory.id,
      shop: testShop,
      category: testCategory,
      isActive: true
    });
    await serviceRepository.save(testService);
  });

  afterAll(async () => {
    try {
      if (createdBookingId) {
        await bookingRepository.delete(createdBookingId);
      }

      const user = await userRepository.findOneBy({ email: guestEmail });
      if (user) {
        await userRepository.delete(user.id);
      }

      // Delete Service before Category/Shop
      if (testService) await serviceRepository.delete(testService.id);
      if (testCategory) await categoryRepository.delete(testCategory.id);
      if (testShop) await shopRepository.delete(testShop.id);
    } catch (e) {
      console.error('Teardown failed:', e);
    }
    await app.close();
  });

  it('/bookings/public (POST) should create a booking', async () => {
    const bookingData = {
      services: [testService.id],
      shopId: testShop.id,
      appointmentDate: new Date().toISOString(),
      startTime: '10:00',
      guestName: 'E2E Guest',
      guestPhone: '555-0000',
      guestEmail: guestEmail
    };

    const response = await request(app.getHttpServer())
      .post('/bookings/public')
      .send(bookingData)
      .expect(201);

    createdBookingId = response.body.id;

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.customerId).toBeDefined();
    expect(response.body.shopId).toBe(testShop.id);
  });
});
