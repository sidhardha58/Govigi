/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CheckoutDto } from './dto/checkout.dto';
import { CartService } from '../cart/cart.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly cartService: CartService,
    private readonly walletService: WalletService,
  ) {}

  async checkout(userId: string, dto: CheckoutDto) {
    const cart = await this.cartService.getMyCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Create order items from cart
    const items = cart.items.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    const order = await this.orderModel.create({
      user: new Types.ObjectId(userId),
      address: new Types.ObjectId(dto.addressId),
      items,
      totalAmount: cart.totalAmount,
      paymentMethod: dto.paymentMethod,
      paymentStatus: dto.paymentMethod === 'WALLET' ? 'PAID' : 'UNPAID',
      status: dto.paymentMethod === 'WALLET' ? 'PLACED' : 'PLACED',
    });

    // Wallet payment
    if (dto.paymentMethod === 'WALLET') {
      await this.walletService.debit(
        userId,
        cart.totalAmount,
        `ORDER_${order._id}`,
      );
    }

    // Clear cart
    await this.cartService.clearCart(userId);

    return {
      message: 'Order placed successfully',
      orderId: order._id,
    };
  }
}
