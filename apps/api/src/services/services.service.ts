import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginateModel } from '../common/plugins/paginate.plugin';
import { Service, ServiceDocument } from '../schemas/service.schema';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class ServicesService {
  constructor(
    @InjectModel(Service.name) private serviceModel: PaginateModel<ServiceDocument>,
  ) {}

  async create(createServiceDto: CreateServiceDto, user: User) {
    const service = new this.serviceModel({
      ...createServiceDto,
      shopId: user.shopId, // Link to the user's shop
    });
    return service.save();
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, search, categoryId } = query;
    const filter: any = { shopId: user.shopId };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    if (categoryId) {
        filter.categoryId = categoryId;
    }

    return this.serviceModel.paginate(filter, {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: ['categoryId'],
    });
  }

  async findOne(id: string, user: User) {
    const service = await this.serviceModel.findOne({ _id: id, shopId: user.shopId });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto, user: User) {
    const service = await this.serviceModel.findOneAndUpdate(
      { _id: id, shopId: user.shopId },
      updateServiceDto,
      { new: true },
    );

    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }

  async remove(id: string, user: User) {
    const result = await this.serviceModel.deleteOne({ _id: id, shopId: user.shopId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Service not found');
    }
    return { message: 'Service deleted successfully' };
  }
}
