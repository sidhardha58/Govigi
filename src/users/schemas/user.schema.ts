import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop() firstName?: string;
  @Prop() lastName?: string;

  @Prop({ lowercase: true, trim: true, sparse: true })
  email?: string;

  @Prop() businessType?: string;

  @Prop({ required: true, unique: true })
  contact: string;

  // ✅ OPTIONAL password (admin only)
  @Prop({ select: false })
  password?: string;

  // ✅ OTP fields
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
