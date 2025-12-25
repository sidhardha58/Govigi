import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export enum StockStatus {
  AVAILABLE = 'Available',
  OUT_OF_STOCK = 'Out of Stock',
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop()
  category?: string;

  @Prop({ required: true })
  pricePerKg: number;

  @Prop({
    enum: StockStatus,
    default: StockStatus.AVAILABLE,
  })
  stockStatus: StockStatus;

  @Prop({
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Prop({
    type: {
      url: String,
      public_id: String,
    },
  })
  image?: {
    url: string;
    public_id: string;
  };

  @Prop({ default: 0 })
  currentStock: number;

  @Prop({ default: 0 })
  minimumThreshold: number;

  @Prop({ default: 'kg' })
  unit: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
