import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { json, urlencoded } from 'express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { ScheduleModule } from '@nestjs/schedule';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './services/services.module';
import { CategoriesModule } from './categories/categories.module';
import { CustomersModule } from './customers/customers.module';
import { StaffModule } from './staff/staff.module';
import { BookingsModule } from './bookings/bookings.module';
import { ShopsModule } from './shops/shops.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { BillingModule } from './billing/billing.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env', '../../.env'],
    }),

    // Database (Postgres with TypeORM)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE', 'salonpro'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables (Dev only)
      }),
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

    ShopsModule,
    PaymentsModule,
    NotificationsModule,
    ReviewsModule,
    AnalyticsModule,
    BillingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. Raw body for Stripe Webhook
    consumer
      .apply(json({
        verify: (req: any, res, buf) => {
          if (buf && buf.length) {
            req.rawBody = buf;
          }
        }
      }))
      .forRoutes({ path: 'payments/webhook', method: RequestMethod.POST });

    // 2. Standard JSON for everything else
    consumer
      .apply(json())
      .exclude({ path: 'payments/webhook', method: RequestMethod.POST })
      .forRoutes('*');

    // 3. URL Encoded for everything
    consumer
      .apply(urlencoded({ extended: true }))
      .forRoutes('*');
  }
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async onModuleInit() {
    await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS postgis');
    await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  }
}
