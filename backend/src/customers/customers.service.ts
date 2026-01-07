import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto, user: User) {
    try {
      const customer = this.customerRepository.create({
        ...createCustomerDto,
        shopId: user.shopId,
      });
      return await this.customerRepository.save(customer);
    } catch (error: any) {
      if (error.code === '23505') { // Postgres unique violation
        throw new ConflictException('Customer with this phone number already exists in this shop');
      }
      throw error;
    }
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, search, tier } = query;
    const qb = this.customerRepository.createQueryBuilder('customer');
    qb.where('customer.shopId = :shopId', { shopId: user.shopId });

    if (search) {
      qb.andWhere(
        '(customer.fullName ILIKE :search OR customer.phone ILIKE :search OR customer.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (tier) {
      qb.andWhere('customer.membershipTier = :tier', { tier });
    }

    qb.orderBy('customer.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

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
    const customer = await this.customerRepository.findOne({ 
        where: { id, shopId: user.shopId } 
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto, user: User) {
    await this.customerRepository.update({ id, shopId: user.shopId }, updateCustomerDto);
    return this.findOne(id, user);
  }

  async remove(id: string, user: User) {
    const result = await this.customerRepository.delete({ id, shopId: user.shopId });
    if (result.affected === 0) {
      throw new NotFoundException('Customer not found');
    }
    return { message: 'Customer deleted successfully' };
  }
}
