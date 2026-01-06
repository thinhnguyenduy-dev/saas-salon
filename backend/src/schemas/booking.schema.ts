import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';
import { Customer } from './customer.schema';
import { Staff } from './staff.schema';
import { Service } from './service.schema';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({ required: true, unique: true, index: true })
  bookingCode: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true, index: true })
  customerId: Customer | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Staff' })
  staffId?: Staff | Types.ObjectId; // Optional if "Any Staff"

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Service' }], required: true })
  services: (Service | Types.ObjectId)[];

  @Prop({ required: true, index: true })
  appointmentDate: Date; // Full ISO Date

  @Prop({ required: true })
  startTime: string; // HH:mm

  @Prop({ required: true })
  endTime: string; // HH:mm - Calculated based on duration

  @Prop({ required: true })
  totalDuration: number; // Minutes

  @Prop({ required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: BookingStatus,
    default: BookingStatus.PENDING,
    index: true,
  })
  status: BookingStatus;

  @Prop()
  notes?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.plugin(PaginatePlugin);

// Hook to generate Booking Code: #B-TIMESTAMP-RANDOM
BookingSchema.pre('save', function () {
  if (!this.bookingCode) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    this.bookingCode = `BK${timestamp}${random}`;
  }
});
