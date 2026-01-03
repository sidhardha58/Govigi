/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Req,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item';
import { AuthGuard } from '@nestjs/passport';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // 🛒 Get my cart
  @Get()
  getMyCart(@Req() req) {
    return this.cartService.getMyCart(req.user.userId);
  }

  // ➕ Add / increment item
  @Post('add')
  addToCart(@Req() req, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(
      req.user.userId,
      dto.productId,
      dto.quantity,
    );
  }

  // ✏️ Set exact quantity
  @Put('item/:productId')
  updateItemQuantity(
    @Req() req,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(
      req.user.userId,
      productId,
      dto.quantity,
    );
  }

  // ➖ Decrement quantity by 1 (optional but nice)
  @Post('decrement/:productId')
  decrementItem(@Req() req, @Param('productId') productId: string) {
    return this.cartService.decrementItem(req.user.userId, productId);
  }

  // 🗑️ Remove item completely
  @Delete('remove/:productId')
  removeFromCart(@Req() req, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(req.user.userId, productId);
  }
}
