/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import {
  WalletTransaction,
  WalletTransactionDocument,
  WalletTransactionType,
} from './schemas/wallet-transaction.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly walletModel: Model<WalletDocument>,

    @InjectModel(WalletTransaction.name)
    private readonly txnModel: Model<WalletTransactionDocument>,
  ) {}

  async getOrCreateWallet(userId: string) {
    let wallet = await this.walletModel.findOne({ user: userId });

    if (!wallet) {
      wallet = await this.walletModel.create({
        user: userId,
        balance: 0,
      });
    }

    return wallet;
  }

  async credit(
    userId: string,
    amount: number,
    reference?: string,
  ): Promise<WalletDocument> {
    if (amount <= 0) {
      throw new BadRequestException('Invalid credit amount');
    }

    const wallet = await this.getOrCreateWallet(userId);

    wallet.balance += amount;
    await wallet.save();

    await this.txnModel.create({
      wallet: wallet._id,
      type: WalletTransactionType.CREDIT,
      amount,
      reference,
    });

    return wallet;
  }

  async debit(
    userId: string,
    amount: number,
    reference?: string,
  ): Promise<WalletDocument> {
    if (amount <= 0) {
      throw new BadRequestException('Invalid debit amount');
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException('Insufficient wallet balance');
    }

    wallet.balance -= amount;
    await wallet.save();

    await this.txnModel.create({
      wallet: wallet._id,
      type: WalletTransactionType.DEBIT,
      amount,
      reference,
    });

    return wallet;
  }

  async getTransactions(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);

    return this.txnModel.find({ wallet: wallet._id }).sort({ createdAt: -1 });
  }
}
