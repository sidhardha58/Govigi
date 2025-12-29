import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true })
export class Customer {
  // BUSINESS IDENTITY

  @Prop({ required: true })
  customerName: string;

  @Prop({ unique: true, sparse: true })
  customerEmail?: string;

  @Prop({ required: true })
  customerPhone: string;

  // CONTACT PERSON

  @Prop({ required: true })
  customerContactPerson: string;

  @Prop({ required: true })
  customerContactPersonNumber: string;

  // ADDRESS & TYPE

  @Prop({ type: Types.ObjectId, ref: 'Address', required: true })
  customerAddress: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'CustomerType', required: true })
  customerType: Types.ObjectId;

  // STATUS

  @Prop({
    enum: ['active', 'inactive', 'pending', 'blocked'],
    default: 'pending',
  })
  customerStatus: string;

  // BUSINESS ASSETS

  @Prop([
    {
      url: { type: String },
      public_id: { type: String },
    },
  ])
  businessImages: { url: string; public_id: string }[];

  // RELATIONS

  @Prop([{ type: Types.ObjectId, ref: 'orders' }])
  orders: Types.ObjectId[];

  // HYBRID LINK — OWNER USER
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    unique: true,
    required: true,
    index: true,
  })
  user: Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
