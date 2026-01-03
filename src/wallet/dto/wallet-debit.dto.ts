import { IsInt, Min } from 'class-validator';

export class WalletDebitDto {
  @IsInt()
  @Min(1)
  amount: number;

  reference?: string;
}
