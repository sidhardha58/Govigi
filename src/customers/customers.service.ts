/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  /**
   * Create a new customer and link it to the authenticated user
   * @param dto Customer data from request body
   * @param userId ID of the user creating this customer (from JWT)
   */
  async create(dto: CreateCustomerDto, userId: string): Promise<Customer> {
    const existing = await this.customerModel.findOne({ user: userId });
    if (existing) {
      throw new BadRequestException('Customer profile already exists');
    }

    try {
      const customer = new this.customerModel({
        ...dto,
        user: new Types.ObjectId(userId),
      });
      return await customer.save();
    } catch (err: any) {
      if (err.code === 11000) {
        throw new BadRequestException(
          'Customer profile already exists for this user',
        );
      }
      throw err;
    }
  }

  /** Fetch all customers */
  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  /** Fetch a single customer by ID */
  async findById(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(
    id: string,
    updateData: Partial<CreateCustomerDto>,
  ): Promise<Customer> {
    // Create a copy to avoid type mismatch
    const mongoUpdate: any = { ...updateData };

    if (updateData.customerAddress) {
      mongoUpdate.customerAddress = new Types.ObjectId(
        updateData.customerAddress,
      );
    }

    if (updateData.customerType) {
      mongoUpdate.customerType = new Types.ObjectId(updateData.customerType);
    }

    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(id, mongoUpdate, { new: true })
      .exec();

    if (!updatedCustomer) throw new NotFoundException('Customer not found');
    return updatedCustomer;
  }

  async findByUser(userId: string): Promise<Customer> {
    const customer = await this.customerModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('customerAddress')
      .populate('customerType')
      .exec();

    if (!customer) {
      throw new NotFoundException('Customer profile not found');
    }

    return customer;
  }
}
