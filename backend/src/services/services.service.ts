import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, user: User) {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      shopId: user.shopId,
    });
    return this.serviceRepository.save(service);
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, search, categoryId } = query;
    const qb = this.serviceRepository.createQueryBuilder('service');
    qb.where('service.shopId = :shopId', { shopId: user.shopId });

    if (search) {
      qb.andWhere('service.name ILIKE :search', { search: `%${search}%` });
    }
    
    if (categoryId) {
        qb.andWhere('service.categoryId = :categoryId', { categoryId });
    }

    qb.orderBy('service.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);
    // qb.leftJoinAndSelect('service.category', 'category'); // If needed

    const [items, total] = await qb.getManyAndCount();

    return {
      docs: items,
      totalDocs: total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, user: User) {
    const service = await this.serviceRepository.findOne({ 
        where: { id, shopId: user.shopId } 
    });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, user: User) {
    // TypeORM update does not return updated entity by default
    await this.serviceRepository.update({ id, shopId: user.shopId }, updateServiceDto);
    return this.findOne(id, user);
  }

  async remove(id: string, user: User) {
    const result = await this.serviceRepository.delete({ id, shopId: user.shopId });
    if (result.affected === 0) {
      throw new NotFoundException('Service not found');
    }
    return { message: 'Service deleted successfully' };
  }
}
