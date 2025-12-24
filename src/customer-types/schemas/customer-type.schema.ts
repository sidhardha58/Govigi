import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerTypeDocument = CustomerType & Document;

@Schema({ timestamps: true })
export class CustomerType {
  @Prop({ required: true, unique: true, trim: true })
  typeName: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({
    enum: ['active', 'inactive'],
    default: 'active',
  })
  status: 'active' | 'inactive';
}

export const CustomerTypeSchema = SchemaFactory.createForClass(CustomerType);
