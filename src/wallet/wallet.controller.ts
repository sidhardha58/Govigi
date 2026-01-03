/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletCreditDto } from './dto/wallet-credit.dto';
import { WalletDebitDto } from './dto/wallet-debit.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('wallet')
@UseGuards(AuthGuard('jwt'))
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // 🔹 Get wallet (auto-create)
  @Get()
  getWallet(@Req() req) {
    return this.walletService.getOrCreateWallet(req.user.userId);
  }

  // 🔹 Wallet transaction history
  @Get('transactions')
  getTransactions(@Req() req) {
    return this.walletService.getTransactions(req.user.userId);
  }

  // 🔹 CREDIT (top-up / admin / testing)
  @Post('credit')
  creditWallet(@Req() req, @Body() dto: WalletCreditDto) {
    return this.walletService.credit(
      req.user.userId,
      dto.amount,
      dto.reference ?? 'manual-credit',
    );
  }

  // 🔹 DEBIT (TEMP – for testing checkout)
  @Post('debit')
  debitWallet(@Req() req, @Body() dto: WalletDebitDto) {
    return this.walletService.debit(
      req.user.userId,
      dto.amount,
      dto.reference ?? 'manual-debit',
    );
  }
}
