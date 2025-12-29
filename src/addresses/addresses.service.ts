import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Address, AddressDocument } from './schemas/address.schema';
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name)
    private readonly addressModel: Model<AddressDocument>,
  ) {}

  async create(dto: CreateAddressDto, userId: string): Promise<Address> {
    if (dto.isDefault) {
      // unset existing default addresses
      await this.addressModel.updateMany(
        { user: userId, isDefault: true },
        { isDefault: false },
      );
    }

    const address = new this.addressModel({
      ...dto,
      user: new Types.ObjectId(userId),
    });

    return address.save();
  }

  async findByUser(userId: string): Promise<Address[]> {
    return this.addressModel
      .find({ user: userId })
      .populate('user', 'contact role')
      .exec();
  }

  async findById(id: string): Promise<Address> {
    const address = await this.addressModel.findById(id).exec();
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }
}
