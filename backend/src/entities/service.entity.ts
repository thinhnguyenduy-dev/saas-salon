import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Shop } from './shop.entity';
import { ServiceCategory } from './service-category.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  shopId: string;

  @ManyToOne(() => Shop, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'shopId' })
  shop: Shop;

  @Column()
  categoryId: string;

  @ManyToOne(() => ServiceCategory, { onDelete: 'SET NULL' }) // If category deleted, maybe keep service?
  @JoinColumn({ name: 'categoryId' })
  category: ServiceCategory;

  @Column()
  name: string;

  @Column()
  duration: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description: string;

  @Column('text', { array: true, default: [] })
  images: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
