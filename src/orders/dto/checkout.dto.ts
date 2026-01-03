import { IsEnum, IsMongoId } from 'class-validator';

export class CheckoutDto {
  @IsMongoId()
  addressId: string;

  @IsEnum(['COD', 'WALLET'])
  paymentMethod: 'COD' | 'WALLET';
}
