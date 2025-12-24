import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Address, AddressSchema } from './address.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop() firstName?: string;
  @Prop() lastName?: string;

  @Prop({
    lowercase: true,
    trim: true,
  })
  email?: string;

  @Prop() businessType?: string;

  @Prop({ type: [AddressSchema], default: [] })
  addresses: Address[];

  @Prop({ required: true, unique: true })
  contact: string;

  @Prop({ required: true })
  password: string;

  @Prop() otp?: string;
  @Prop() otpExpires?: Date;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'product' }],
    default: [],
  })
  wishlist: Types.ObjectId[];

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'orders' }],
    default: [],
  })
  orders: Types.ObjectId[];

  @Prop({
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer',
  })
  role: 'customer' | 'vendor' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ contact: 1 }, { unique: true });
