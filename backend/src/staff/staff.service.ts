import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Staff } from '../entities/staff.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
  ) {}

  async create(createStaffDto: CreateStaffDto, user: User) {
    const staff = this.staffRepository.create({
      ...createStaffDto,
      shopId: user.shopId,
    });
    return this.staffRepository.save(staff);
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, search } = query;
    const qb = this.staffRepository.createQueryBuilder('staff');
    qb.where('staff.shopId = :shopId', { shopId: user.shopId });

    if (search) {
      qb.andWhere('staff.fullName ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('staff.createdAt', 'DESC');
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
    const staff = await this.staffRepository.findOne({ 
        where: { id, shopId: user.shopId } 
    });
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, user: User) {
    const staff = await this.staffRepository.findOne({ where: { id, shopId: user.shopId } });
    if (!staff) throw new NotFoundException('Staff not found');
    
    Object.assign(staff, updateStaffDto);
    return this.staffRepository.save(staff);
  }

  async remove(id: string, user: User) {
    const result = await this.staffRepository.delete({ id, shopId: user.shopId });
    if (result.affected === 0) {
      throw new NotFoundException('Staff not found');
    }
    return { message: 'Staff deleted successfully' };
  }
}
