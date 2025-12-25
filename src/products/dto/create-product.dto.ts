/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProductStatus, StockStatus } from '../schemas/product.schema';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsNumber()
  pricePerKg: number;

  @IsEnum(StockStatus)
  stock: StockStatus;

  @IsOptional()
  @IsNumber()
  currentStock?: number;

  @IsOptional()
  @IsNumber()
  minimumThreshold?: number;
}
