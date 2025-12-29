/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
// import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('customers')
@UseGuards(AuthGuard('jwt'))
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // customers.controller.ts
  @Post()
  create(@Req() req, @Body() dto: CreateCustomerDto) {
    const userId = req.user.userId; // from JWT
    return this.customersService.create(dto, userId);
  }

  @Get('me')
  getMyProfile(@Req() req) {
    const userId = req.user.userId;
    return this.customersService.findByUser(userId);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findById(id);
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() dto: UpdateCustomerDto) {
  //   return this.customersService.update(id, dto);
  // }
}
