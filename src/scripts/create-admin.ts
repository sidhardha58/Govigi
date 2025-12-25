/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

async function bootstrapAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersService = app.get(UsersService);

  const adminContact = '8888888888'; // change later
  const adminPassword = 'Admin@123'; // change later

  const existingAdmin = await usersService.findByContact(adminContact);

  if (existingAdmin) {
    console.log('❌ Admin already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await usersService.create({
    contact: adminContact,
    password: hashedPassword,
    role: 'admin',
    firstName: 'Super',
    lastName: 'Admin',
  });

  console.log('✅ Admin created successfully');
  process.exit(0);
}

bootstrapAdmin();
