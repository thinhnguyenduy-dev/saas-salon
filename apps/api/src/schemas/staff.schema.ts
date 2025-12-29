import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';
import { User } from './user.schema';

export type StaffDocument = HydratedDocument<Staff>;

// Minimal schedule for now, can be expanded
@Schema({ _id: false })
export class WorkShift {
  @Prop({ required: true })
  dayOfWeek: number; // 0-6

  @Prop({ required: true })
  startTime: string; // HH:mm

  @Prop({ required: true })
  endTime: string; // HH:mm
}

@Schema({ timestamps: true })
export class Staff {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  // Link to User for login (optional if staff doesn't login)
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: User | Types.ObjectId;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  phone?: string;

  @Prop()
  email?: string;

  @Prop({ type: [String], default: [] })
  skills: string[]; // Array of Service IDs or tags

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: [WorkShift], default: [] })
  workSchedule: WorkShift[];

  @Prop({ default: 0 })
  baseSalary: number;

  @Prop({ default: 0 })
  commissionRate: number; // Percent 0-100
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.plugin(PaginatePlugin);
