import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type WalletTransactionDocument = WalletTransaction & Document;

export enum WalletTransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

@Schema({ timestamps: true })
export class WalletTransaction {
  @Prop({ type: Types.ObjectId, ref: 'Wallet', required: true })
  wallet: Types.ObjectId;

  @Prop({ enum: WalletTransactionType, required: true })
  type: WalletTransactionType;

  @Prop({ required: true })
  amount: number;

  @Prop()
  reference?: string; // orderId, refundId, adminTopup, etc
}

export const WalletTransactionSchema =
  SchemaFactory.createForClass(WalletTransaction);
