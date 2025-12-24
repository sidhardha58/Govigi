import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import { CustomersModule } from './customers/customers.module';
import { CustomerTypesModule } from './customer-types/customer-types.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // MongoDB connection
    MongooseModule.forRoot(process.env.MONGO_URI as string),

    // Feature modules
    UsersModule,
    AuthModule,
    CustomersModule,
    CustomerTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
