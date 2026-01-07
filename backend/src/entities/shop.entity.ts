import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('shops')
export class Shop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index({ fulltext: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  image: string;

  // Flattened address or JSON? Let's use JSONB for flexibility now, or simple columns.
  // Address usually needs filtering (City/District). Let's use columns.
  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column({ nullable: true })
  ward: string;

  @Index({ spatial: true })
  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: { type: string; coordinates: number[] }; // GeoJSON format

  @Column({ type: 'jsonb', default: [] })
  businessHours: any[];

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @Column({ enum: ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'], default: 'FREE' })
  subscriptionPlan: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.shop)
  users: User[];
}
