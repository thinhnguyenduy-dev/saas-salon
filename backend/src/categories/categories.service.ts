import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from '../entities/service-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { User } from '../entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(ServiceCategory) private categoryRepository: Repository<ServiceCategory>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, user: User) {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      shopId: user.shopId,
    });
    return this.categoryRepository.save(category);
  }

  async findAll(query: any, user: User) {
    const { page = 1, limit = 100, search } = query;
    const qb = this.categoryRepository.createQueryBuilder('category');
    qb.where('category.shopId = :shopId', { shopId: user.shopId });

    if (search) {
      qb.andWhere('category.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy('category.name', 'ASC');
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
    const category = await this.categoryRepository.findOne({ where: { id, shopId: user.shopId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, user: User) {
    await this.categoryRepository.update({ id, shopId: user.shopId }, updateCategoryDto);
    return this.findOne(id, user);
  }

  async remove(id: string, user: User) {
    const result = await this.categoryRepository.delete({ id, shopId: user.shopId });
    if (result.affected === 0) {
      throw new NotFoundException('Category not found');
    }
    return { message: 'Category deleted successfully' };
  }
}
