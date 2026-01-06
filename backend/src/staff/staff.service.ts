import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from '../common/plugins/paginate.plugin';
import { Staff, StaffDocument } from '../schemas/staff.schema';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: PaginateModel<StaffDocument>,
  ) {}

  async create(createStaffDto: CreateStaffDto, user: User) {
    const staff = new this.staffModel({
      ...createStaffDto,
      shopId: user.shopId,
    });
    return staff.save();
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 10, search } = query;
    const filter: any = { shopId: user.shopId };

    if (search) {
      filter.fullName = { $regex: search, $options: 'i' };
    }

    return this.staffModel.paginate(filter, {
      page,
      limit,
      sort: { createdAt: -1 },
    });
  }

  async findOne(id: string, user: User) {
    const staff = await this.staffModel.findOne({ _id: id, shopId: user.shopId });
    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  async update(id: string, updateStaffDto: UpdateStaffDto, user: User) {
    const staff = await this.staffModel.findOneAndUpdate(
      { _id: id, shopId: user.shopId },
      updateStaffDto,
      { new: true },
    );

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }
    return staff;
  }

  async remove(id: string, user: User) {
    const result = await this.staffModel.deleteOne({ _id: id, shopId: user.shopId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Staff not found');
    }
    return { message: 'Staff deleted successfully' };
  }
}
