/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  // CREATE PRODUCT (ADMIN)
  async create(dto: CreateProductDto, image?: any) {
    return this.productModel.create({
      ...dto,
      image,
    });
  }

  // GET ALL PRODUCTS (PUBLIC)
  async findAll(query: any) {
    const page = Number(query.page);
    const limit = Number(query.perPage || query.limit) || 10;
    const offset =
      query.offset !== undefined ? Number(query.offset) : undefined;

    // No pagination → return all
    if (!page && offset === undefined) {
      return this.productModel.find();
    }

    const skip = offset ?? (page - 1) * limit;

    return this.productModel.find().skip(skip).limit(limit);
  }

  // GET PRODUCT BY ID (PUBLIC)
  async findById(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // UPDATE PRODUCT (ADMIN)
  async update(id: string, dto: UpdateProductDto, image?: any) {
    const updateData: any = { ...dto };
    if (image) updateData.image = image;

    const updated = await this.productModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      throw new NotFoundException('Product not found');
    }
    return updated;
  }

  // DELETE PRODUCT (ADMIN)
  async delete(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Deleted successfully' };
  }

  // BULK UPDATE (ADMIN) — SAFE VERSION
  async bulkUpdate(productIds: string[], updates: any) {
    const allowedUpdates: any = {};

    if (updates.pricePerKg !== undefined) {
      allowedUpdates.pricePerKg = updates.pricePerKg;
    }

    if (updates.stock) {
      allowedUpdates.stock = updates.stock;
    }

    if (updates.status) {
      allowedUpdates.status = updates.status;
    }

    if (updates.category) {
      allowedUpdates.category = updates.category;
    }

    return this.productModel.updateMany(
      { _id: { $in: productIds } },
      { $set: allowedUpdates },
    );
  }
}
