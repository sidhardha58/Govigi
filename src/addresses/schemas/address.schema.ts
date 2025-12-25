import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type AddressDocument = Address & Document;

@Schema({ timestamps: true })
export class Address {
  // Address label (Home, Office, Warehouse)
  @Prop({ required: true })
  label: string;

  // Receiver name
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  contact: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  addressLine1: string;

  @Prop()
  addressLine2?: string;

  @Prop()
  landmark?: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop({ required: true })
  pincode: string;

  @Prop({
    enum: ['home', 'office', 'warehouse'],
    default: 'home',
  })
  addressType: 'home' | 'office' | 'warehouse';

  @Prop({ default: false })
  isDefault: boolean;

  // 👇 Ownership (admin / customer / vendor)
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const AddressSchema = SchemaFactory.createForClass(Address);

// Helpful index
AddressSchema.index({ user: 1 });
