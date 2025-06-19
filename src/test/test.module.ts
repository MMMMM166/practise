// test.module.ts
import { Module } from '@nestjs/common';
import { TestController } from './test.controller';

import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@prisma/prisma.service';
import { UserService } from '@user/user.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@auth/auth.service';

@Module({
  imports: [
    JwtModule.register({}), // Импортируем JwtModule
  ],
  controllers: [TestController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    ConfigService,
  ],
})
export class TestModule {}