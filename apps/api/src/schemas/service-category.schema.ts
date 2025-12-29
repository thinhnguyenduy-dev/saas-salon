import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';

export type ServiceCategoryDocument = HydratedDocument<ServiceCategory>;

@Schema({ timestamps: true })
export class ServiceCategory {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  displayOrder: number;

  @Prop()
  color?: string; // Hex color for UI
}

export const ServiceCategorySchema =
  SchemaFactory.createForClass(ServiceCategory);

ServiceCategorySchema.plugin(PaginatePlugin);
ServiceCategorySchema.index({ shopId: 1, slug: 1 }, { unique: true });
