import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { PaginatePlugin } from '../common/plugins/paginate.plugin';
import { Shop } from './shop.schema';

export type ProductDocument = HydratedDocument<Product>;
export type InventoryLogDocument = HydratedDocument<InventoryLog>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sku: string; // Stock Keeping Unit

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  costPrice: number;

  @Prop({ default: 0 })
  stockQuantity: number;

  @Prop({ default: 0 })
  alertThreshold: number; // Low stock alert

  @Prop()
  unit: string; // e.g., 'bottle', 'box'
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(PaginatePlugin);
ProductSchema.index({ shopId: 1, sku: 1 }, { unique: true });

export enum InventoryAction {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT', // Sold or Used
  ADJUST = 'ADJUST',
}

@Schema({ timestamps: true })
export class InventoryLog {
  @Prop({ type: Types.ObjectId, ref: 'Shop', required: true, index: true })
  shopId: Shop | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  productId: Product | Types.ObjectId;

  @Prop({ required: true, enum: InventoryAction })
  action: InventoryAction;

  @Prop({ required: true })
  quantityChange: number; // + or -

  @Prop({ required: true })
  reason: string;
}

export const InventoryLogSchema = SchemaFactory.createForClass(InventoryLog);
InventoryLogSchema.plugin(PaginatePlugin);
