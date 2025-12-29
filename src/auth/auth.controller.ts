/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ============ ADMIN LOGIN ============
  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body.email, body.password);
  }

  // ============ SEND OTP ============
  @Post('send-otp')
  sendOtp(@Body('contact') contact: string) {
    return this.authService.sendOtp(contact);
  }

  // ============ VERIFY OTP ============
  @Post('verify-otp')
  verifyOtp(@Body('contact') contact: string, @Body('otp') otp: string) {
    return this.authService.verifyOtp(contact, otp);
  }

  // ============ ME ============
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return req.user;
  }
}
