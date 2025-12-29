import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';
import { ServiceCategory } from './service-category.schema';

export type ServiceDocument = HydratedDocument<Service>;

@Schema({ timestamps: true })
export class Service {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'ServiceCategory',
    required: true,
    index: true,
  })
  categoryId: ServiceCategory | Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  duration: number; // in minutes

  @Prop({ required: true })
  price: number;

  @Prop()
  description?: string;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

ServiceSchema.plugin(PaginatePlugin);
