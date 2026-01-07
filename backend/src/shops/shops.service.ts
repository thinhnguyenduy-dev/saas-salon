import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';
import { Service } from '../entities/service.entity';
import { Staff } from '../entities/staff.entity';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop) private shopRepository: Repository<Shop>,
    @InjectRepository(Service) private serviceRepository: Repository<Service>,
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
  ) {}

  async findAllPublic(query: any) {
    const { page = 1, limit = 10, search, lat, lng, maxDistance = 5000 } = query;
    
    const qb = this.shopRepository.createQueryBuilder('shop');
    qb.select(['shop.id', 'shop.name', 'shop.slug', 'shop.street', 'shop.city', 'shop.district', 'shop.ward', 'shop.location', 'shop.businessHours', 'shop.subscriptionPlan']);
    qb.where('shop.isActive = :isActive', { isActive: true });

    if (search) {
        qb.andWhere('shop.name ILIKE :search', { search: `%${search}%` });
    }

    if (lat && lng) {
        // Use PostGIS logic. Assumes 'location' is 'geometry(Point, 4326)'
        const origin = `ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)`;
        // distance in meters (using ::geography cast)
        qb.andWhere(`ST_DWithin(shop.location::geography, ${origin}::geography, :maxDistance)`, { 
            lng: Number(lng), 
            lat: Number(lat), 
            maxDistance: Number(maxDistance) 
        });
        
        qb.orderBy(`ST_Distance(shop.location::geography, ${origin}::geography)`, 'ASC');
    } else {
        qb.orderBy('shop.createdAt', 'DESC');
    }

    // Filter by Category (if Shop has any service in this category)
    if (query.category) {
        // We need to use a subquery to avoid messing up the main query granularity or duplicates
        // "Find shops where ID is IN (select shopId from services join categories...)"
        qb.andWhere(qb => {
            const subQuery = qb.subQuery()
                .select("s.shopId")
                .from(Service, "s")
                .innerJoin("s.category", "cat")
                .where("cat.name ILIKE :catName", { catName: `%${query.category}%` })
                .getQuery();
            return "shop.id IN " + subQuery;
        });
    }

    const [items, total] = await qb
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

    return {
        docs: items,
        totalDocs: total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
    };
  }

  async findOnePublic(slug: string) {
    const shop = await this.shopRepository.findOne({ 
        where: { slug, isActive: true } 
    });

    if (!shop) {
      throw new NotFoundException('Shop not found');
    }

    // Top Services
    // All Services with Categories
    const services = await this.serviceRepository.find({
        where: { shopId: shop.id, isActive: true },
        relations: ['category'],
        order: { category: { name: 'ASC' } }
    });
    
    // Staff
    const staff = await this.staffRepository.find({
        where: { shopId: shop.id, isActive: true },
        select: ['id', 'fullName', 'skills']
    });

    return {
      shop,
      services,
      staff,
    };
  }
}
