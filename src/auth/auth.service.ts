/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly smsService: SmsService,
  ) {}

  // ================= ADMIN SIGNIN =================
  async signin(email: string, password: string) {
    const user = await this.usersService.findAdminByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid admin credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    return {
      message: 'Admin login successful',
      access_token: this.jwtService.sign(payload),
    };
  }

  // ================= SEND OTP =================
  async sendOtp(contact: string) {
    if (!contact) {
      throw new BadRequestException('Contact number is required');
    }

    const formattedContact = contact.replace(/^91/, '');

    let user = await this.usersService.findByContact(formattedContact);

    if (!user) {
      user = await this.usersService.createUser({
        contact: formattedContact,
        role: 'customer',
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.usersService.updateOtp(user._id, hashedOtp, expiresAt);

    try {
      await this.smsService.sendOtp(formattedContact, otp);
    } catch (err) {
      console.warn('SMS failed, DEV MODE OTP:', otp);
    }

    return {
      message: 'OTP sent successfully',
      contact: formattedContact,
    };
  }

  // ================= VERIFY OTP =================
  async verifyOtp(contact: string, otp: string) {
    const user = await this.usersService.findByContact(contact);

    if (!user || !user.otp || !user.otpExpires) {
      throw new UnauthorizedException('OTP expired or invalid');
    }

    if (user.otpExpires < new Date()) {
      throw new UnauthorizedException('OTP expired');
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    if (hashedOtp !== user.otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after success
    await this.usersService.clearOtp(user._id);

    const payload = {
      sub: user._id,
      role: user.role,
      contact: user.contact,
    };

    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload),
    };
  }
}
