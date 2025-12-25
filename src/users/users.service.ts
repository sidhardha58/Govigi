import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // Create user (generic - used for admin, customer, vendor)
  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  // Backward compatibility (if already used elsewhere)
  async createUser(data: Partial<User>) {
    return this.create(data);
  }

  // Find by contact (USED FOR ADMIN BOOTSTRAP)
  async findByContact(contact: string) {
    return this.userModel.findOne({ contact }).exec();
  }

  // Find by email
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  // Find by ID
  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  // find all admins (useful later)
  async findAdmins() {
    return this.userModel.find({ role: 'admin' }).exec();
  }
}
