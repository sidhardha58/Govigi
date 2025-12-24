import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  contact: string;

  @Prop()
  email?: string;

  @Prop()
  landmark?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({ required: true })
  state: string;

  // 👇 ownership
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
