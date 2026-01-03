import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  address: Types.ObjectId;

  @Prop([
    {
      product: { type: Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ])
  items: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ enum: ['COD', 'WALLET'], required: true })
  paymentMethod: string;

  @Prop({ enum: ['PAID', 'UNPAID'], default: 'UNPAID' })
  paymentStatus: string;

  @Prop({
    enum: ['PENDING_PAYMENT', 'PLACED', 'CANCELLED'],
    default: 'PLACED',
  })
  status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
