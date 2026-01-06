import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';
import { User } from './user.schema';

export type NotificationLogDocument = HydratedDocument<NotificationLog>;

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  ZALO = 'ZALO', // Vietnam specific
}

@Schema({ timestamps: true })
export class NotificationLog {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId?: User | Types.ObjectId; // Recipient User

  @Prop()
  recipient: string; // Email or Phone

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ required: true })
  subject: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 'PENDING' })
  status: 'PENDING' | 'SENT' | 'FAILED';

  @Prop()
  error?: string;
}

export const NotificationLogSchema = SchemaFactory.createForClass(NotificationLog);
NotificationLogSchema.plugin(PaginatePlugin);
