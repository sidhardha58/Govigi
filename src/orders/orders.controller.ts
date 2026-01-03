/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('checkout')
@UseGuards(AuthGuard('jwt'))
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  checkout(@Req() req, @Body() dto: CheckoutDto) {
    return this.orderService.checkout(req.user.userId, dto);
  }
}
