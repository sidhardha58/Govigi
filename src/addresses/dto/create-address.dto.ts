/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  name: string;

  @IsString()
  contact: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  landmark?: string;

  @IsString()
  city: string;

  @IsString()
  pincode: string;

  @IsString()
  state: string;
}
