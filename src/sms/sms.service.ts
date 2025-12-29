/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendOtp(mobile: string, otp: string) {
    const apiKey = this.configService.get<string>('TWO_FACTOR_API_KEY');
    const template = this.configService.get<string>('TWO_FACTOR_TEMPLATE_NAME');

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/${otp}/${template}`;

    try {
      const res = await axios.get(url);
      this.logger.log(`OTP sent to ${mobile}`);
      return res.data;
    } catch (err) {
      this.logger.error(
        '2Factor error',
        JSON.stringify(err.response?.data || err.message),
      );
      throw new Error(err.response?.data?.Details || 'Failed to send OTP');
    }
  }
}
