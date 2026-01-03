/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private readonly cartModel: Model<CartDocument>,

    @InjectModel(Product.name)
    private readonly productModel: Model<any>,
  ) {}

  // ========================
  // GET CART (AUTO CREATE)
  // ========================
  async getMyCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .exec();

    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        items: [],
        totalAmount: 0,
      });
      await cart.save();
    }

    return cart;
  }

  // ========================
  // ADD TO CART (+ button)
  // ========================
  async addToCart(userId: string, productId: string, quantity: number) {
    const product = await this.productModel.findById(productId);
    if (!product) throw new NotFoundException('Product not found');

    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({
        user: userId,
        items: [],
        totalAmount: 0,
      });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);

    if (item) {
      item.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        price: product.pricePerKg,
      });
    }

    this.recalculateTotal(cart);
    return cart.save();
  }

  // ========================
  // UPDATE QUANTITY (INPUT)
  // ========================
  async updateItemQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) throw new NotFoundException('Item not in cart');

    if (quantity === 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    this.recalculateTotal(cart);
    return cart.save();
  }

  // ========================
  // DECREMENT (− button)
  // ========================
  async decrementItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) throw new NotFoundException('Item not in cart');

    item.quantity -= 1;

    if (item.quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    }

    this.recalculateTotal(cart);
    return cart.save();
  }

  // ========================
  // REMOVE ITEM (TRASH)
  // ========================
  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    this.recalculateTotal(cart);
    return cart.save();
  }

  // ========================
  // CLEAR CART (AFTER CHECKOUT)
  // ========================
  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = [];
    cart.totalAmount = 0;

    return cart.save();
  }

  // ========================
  // TOTAL CALC (SINGLE SOURCE)
  // ========================
  private recalculateTotal(cart: CartDocument) {
    cart.totalAmount = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
  }
}
