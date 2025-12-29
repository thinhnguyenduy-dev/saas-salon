import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';

export type ShopDocument = HydratedDocument<Shop>;

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  district: string; // Quan/Huyen

  @Prop()
  ward: string; // Phuong/Xa
}

@Schema({ _id: false })
export class BusinessHour {
  @Prop({ required: true, min: 0, max: 6 })
  dayOfWeek: number; // 0=Sunday, 6=Saturday

  @Prop({ required: true })
  openTime: string; // HH:mm

  @Prop({ required: true })
  closeTime: string; // HH:mm

  @Prop({ default: true })
  isOpen: boolean;
}

@Schema({ timestamps: true })
export class Shop {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  slug: string;

  @Prop({ type: Address })
  address: Address;

  @Prop({ type: [BusinessHour], default: [] })
  businessHours: BusinessHour[];

  @Prop({ type: Object, default: {} })
  settings: Record<string, any>; // Flexible settings

  @Prop({
    type: String,
    enum: ['FREE', 'BASIC', 'PRO', 'ENTERPRISE'],
    default: 'FREE',
  })
  subscriptionPlan: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);
ShopSchema.plugin(PaginatePlugin);
