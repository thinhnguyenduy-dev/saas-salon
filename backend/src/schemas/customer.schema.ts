import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';

export type CustomerDocument = HydratedDocument<Customer>;

export enum MembershipTier {
  BRONZE = 'BRONZE',
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM',
}

@Schema({ _id: false })
export class CustomerStats {
  @Prop({ default: 0 })
  totalBookings: number;

  @Prop({ default: 0 })
  totalRevenue: number;

  @Prop()
  lastVisit: Date;

  @Prop({ default: 0 })
  averageTicketSize: number;
}

@Schema({ timestamps: true })
export class Customer {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, index: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop({
    type: String,
    enum: MembershipTier,
    default: MembershipTier.BRONZE,
  })
  membershipTier: MembershipTier;

  @Prop({ default: 0 })
  loyaltyPoints: number;

  @Prop({ type: CustomerStats, default: () => ({}) })
  stats: CustomerStats;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object, default: {} })
  preferences: Record<string, any>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.plugin(PaginatePlugin);

// Compound index for unique phone per shop
CustomerSchema.index({ shopId: 1, phone: 1 }, { unique: true });
