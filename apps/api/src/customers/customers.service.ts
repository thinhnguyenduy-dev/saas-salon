import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginateModel } from '../common/plugins/paginate.plugin';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: PaginateModel<CustomerDocument>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, user: User) {
    try {
      const customer = new this.customerModel({
        ...createCustomerDto,
        shopId: user.shopId,
      });
      return await customer.save();
    } catch (error: any) {
      if (error.code === 11000) {
        throw new ConflictException('Customer with this phone number already exists in this shop');
      }
      throw error;
    }
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, search, tier } = query;
    const filter: any = { shopId: user.shopId };

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (tier) {
      filter.membershipTier = tier;
    }

    return this.customerModel.paginate(filter, {
      page,
      limit,
      sort: { createdAt: -1 },
    });
  }

  async findOne(id: string, user: User) {
    const customer = await this.customerModel.findOne({ _id: id, shopId: user.shopId });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, user: User) {
    const customer = await this.customerModel.findOneAndUpdate(
      { _id: id, shopId: user.shopId },
      updateCustomerDto,
      { new: true },
    );

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async remove(id: string, user: User) {
    const result = await this.customerModel.deleteOne({ _id: id, shopId: user.shopId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Customer not found');
    }
    return { message: 'Customer deleted successfully' };
  }
}
