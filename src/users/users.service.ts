import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create a new user

  async createUser(data: Partial<User>) {
    const newUser = new this.userModel(data);
    return newUser.save();
  }

  // Find user by email
  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  // Find user by ID
  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }
}

export default UsersService;
