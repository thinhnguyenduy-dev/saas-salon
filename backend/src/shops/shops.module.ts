import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopsController } from './shops.controller';
import { ShopsService } from './shops.service';
import { Shop } from '../entities/shop.entity';
import { Service } from '../entities/service.entity';
import { Staff } from '../entities/staff.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Shop, Service, Staff]),
  ],
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [ShopsService],
})
export class ShopsModule {}
