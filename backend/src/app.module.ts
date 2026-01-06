import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { StaffModule } from './staff/staff.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '../../.env'],
    }),

    // Database (MongoDB)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('DB_HOST', 'localhost');
        const port = configService.get('DB_PORT', '27017');
        const database = configService.get('DB_DATABASE', 'salonpro');
        const username = configService.get('DB_USERNAME');
        const password = configService.get('DB_PASSWORD');
        
        // Build connection string with or without auth
        let uri: string;
        if (username && password) {
          uri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;
        } else {
          uri = `mongodb://${host}:${port}/${database}`;
        }
        
        return { uri };
      },
      inject: [ConfigService],
    }),

    // Queue (Redis via BullMQ)
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    // Cron Jobs
    ScheduleModule.forRoot(),

    UsersModule,

    AuthModule,

    ServicesModule,

    CategoriesModule,

    CustomersModule,

    StaffModule,

    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
