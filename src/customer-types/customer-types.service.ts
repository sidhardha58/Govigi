import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CustomerType,
  CustomerTypeDocument,
} from './schemas/customer-type.schema';
import { CreateCustomerTypeDto } from './dto/create-customer-type.dto';

@Injectable()
export class CustomerTypesService {
  constructor(
    @InjectModel(CustomerType.name)
    private readonly customerTypeModel: Model<CustomerTypeDocument>,
  ) {}

  async create(dto: CreateCustomerTypeDto): Promise<CustomerType> {
    const exists = await this.customerTypeModel.findOne({
      typeName: dto.typeName,
    });

    if (exists) {
      throw new ConflictException('Customer type already exists');
    }

    const customerType = new this.customerTypeModel(dto);
    return customerType.save();
  }

  async findAll(): Promise<CustomerType[]> {
    return this.customerTypeModel.find().exec();
  }
}
