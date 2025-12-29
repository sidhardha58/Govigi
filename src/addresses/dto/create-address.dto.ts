import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAddressDto {
  @IsString()
  label: string;

  @IsString()
  name: string;

  @IsString()
  @Length(10, 15)
  contact: string;

  @IsOptional()
  email?: string;

  @IsString()
  addressLine1: string;

  @IsOptional()
  addressLine2?: string;

  @IsOptional()
  landmark?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  @IsEnum(['home', 'office', 'warehouse'])
  addressType: 'home' | 'office' | 'warehouse';

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
