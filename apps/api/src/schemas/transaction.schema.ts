import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';
import { Booking } from './booking.schema';
import { Customer } from './customer.schema';
import { User } from './user.schema';

export type TransactionDocument = HydratedDocument<Transaction>;

export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  EXPENSE = 'EXPENSE',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  TRANSFER = 'TRANSFER',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Booking' })
  bookingId?: Booking | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customerId?: Customer | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  performedBy: User | Types.ObjectId; // Staff who processed it

  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, enum: PaymentMethod, default: PaymentMethod.CASH })
  paymentMethod: PaymentMethod;

  @Prop()
  notes?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
TransactionSchema.plugin(PaginatePlugin);
