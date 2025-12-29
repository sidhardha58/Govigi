import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  // ================= CREATE =================
  async create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async createUser(data: Partial<User>) {
    return this.create(data);
  }

  // ================= FINDERS =================
  async findByContact(contact: string) {
    return this.userModel.findOne({ contact }).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  // ADMIN ONLY (password selected)
  async findAdminByEmail(email: string) {
    return this.userModel
      .findOne({ email, role: 'admin' })
      .select('+password')
      .exec();
  }

  async findById(id: string | Types.ObjectId) {
    return this.userModel.findById(id).exec();
  }

  async findAdmins() {
    return this.userModel.find({ role: 'admin' }).exec();
  }

  // ================= OTP =================
  async updateOtp(
    userId: string | Types.ObjectId,
    otp: string,
    expiresAt: Date,
  ) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        otp,
        otpExpires: expiresAt,
      },
      { new: true },
    );
  }

  async clearOtp(userId: string | Types.ObjectId) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        otp: null,
        otpExpires: null,
      },
      { new: true },
    );
  }
}
