import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false }) // embedded document
export class Address {
  @Prop() name?: string;
  @Prop() contact?: string;
  @Prop() email?: string;
  @Prop() landmark?: string;
  @Prop() city?: string;
  @Prop() pincode?: string;
  @Prop() state?: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
