import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from '../common/plugins/paginate.plugin';
import { ServiceCategory, ServiceCategoryDocument } from '../schemas/service-category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '../schemas/user.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(ServiceCategory.name) private categoryModel: PaginateModel<ServiceCategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const category = new this.categoryModel({
      ...createCategoryDto,
      shopId: user.shopId,
    });
    return category.save();
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 100, search } = query; // Default limit higher for categories
    const filter: any = { shopId: user.shopId };

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    return this.categoryModel.paginate(filter, {
      page,
      limit,
      sort: { name: 1 },
    });
  }

  async findOne(id: string, user: User) {
    const category = await this.categoryModel.findOne({ _id: id, shopId: user.shopId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: User) {
    const category = await this.categoryModel.findOneAndUpdate(
      { _id: id, shopId: user.shopId },
      updateCategoryDto,
      { new: true },
    );

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async remove(id: string, user: User) {
    const result = await this.categoryModel.deleteOne({ _id: id, shopId: user.shopId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
