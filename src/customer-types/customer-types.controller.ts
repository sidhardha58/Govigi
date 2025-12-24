import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CustomerTypesService } from './customer-types.service';
import { CreateCustomerTypeDto } from './dto/create-customer-type.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('customer-types')
@UseGuards(AuthGuard('jwt')) // optional, recommended
export class CustomerTypesController {
  constructor(private readonly customerTypesService: CustomerTypesService) {}

  @Post()
  create(@Body() dto: CreateCustomerTypeDto) {
    return this.customerTypesService.create(dto);
  }

  @Get()
  findAll() {
    return this.customerTypesService.findAll();
  }
}
