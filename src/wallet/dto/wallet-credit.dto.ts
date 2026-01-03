import { IsNumber, Min } from 'class-validator';

export class WalletCreditDto {
  @IsNumber()
  @Min(1)
  amount: number;
  reference: string;
}
