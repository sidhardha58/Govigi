/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsOptional,
  IsMongoId,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  customerName: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsPhoneNumber()
  customerPhone: string;

  @IsMongoId()
  customerAddress: string;

  @IsString()
  customerContactPerson: string;

  @IsPhoneNumber()
  customerContactPersonNumber: string;

  @IsMongoId()
  customerType: string;
}
