import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { Shop } from '../entities/shop.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { Service } from '../entities/service.entity';
import { Staff } from '../entities/staff.entity';
import { Customer } from '../entities/customer.entity';
import { Booking } from '../entities/booking.entity';

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
    synchronize: true, // Ensure schema exists
  });

  try {
    await dataSource.initialize();
    console.log('Database connected for seeding...');

    // 1. Create Shop
    const shopRepo = dataSource.getRepository(Shop);
    let shop = await shopRepo.findOneBy({ slug: 'beautiful-salon' });
    
    if (!shop) {
      console.log('Creating Shop...');
      shop = shopRepo.create({
        name: 'Beautiful Salon',
        slug: 'beautiful-salon',
        businessHours: [{
          day: 'Monday-Sunday',
          open: '09:00',
          close: '18:00',
        }],
        isActive: true,
        street: '123 Main St',
        city: 'Metropolis',
        district: 'Central District'
      });
      shop = await shopRepo.save(shop);
    } else {
        console.log('Shop already exists.');
    }

    // 2. Create Owner
    const userRepo = dataSource.getRepository(User);
    let owner = await userRepo.findOneBy({ email: 'admin@example.com' });
    
    if (!owner) {
      console.log('Creating Owner...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      owner = userRepo.create({
        fullName: 'Admin Owner',
        email: 'admin@example.com',
        password: hashedPassword,
        shop: shop,
        shopId: shop.id,
        role: UserRole.OWNER,
        isActive: true,
      });
      await userRepo.save(owner);
    } else {
        console.log('Owner already exists.');
    }

    // 3. Create Categories
    const categoryRepo = dataSource.getRepository(ServiceCategory);
    let hairCategory = await categoryRepo.findOneBy({ name: 'Hair', shopId: shop.id });
    
    if (!hairCategory) {
        console.log('Creating Categories...');
        hairCategory = categoryRepo.create({
            name: 'Hair',
            shopId: shop.id,
            description: 'Hair services'
        });
        await categoryRepo.save(hairCategory);
    }

    // 4. Create Service
    const serviceRepo = dataSource.getRepository(Service);
    const existingService = await serviceRepo.findOneBy({ name: 'Haircut', shopId: shop.id });
    
    if (!existingService && hairCategory) {
        console.log('Creating Services...');
        const service = serviceRepo.create({
            name: 'Haircut',
            description: 'Standard haircut',
            price: 25.00,
            duration: 30,
            categoryId: hairCategory.id,
            shopId: shop.id,
            isActive: true
        });
        await serviceRepo.save(service);
    }

    console.log('Seeding completed successfully!');

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await dataSource.destroy();
  }
}

seed();
