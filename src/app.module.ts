import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@auth/guards/jwt-auth.guard';
import { TestModule } from './test/test.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtModuleAsyncOptions } from '@config/jwt-module.config';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: '.env'
    }),
    JwtModule.registerAsync(jwtModuleAsyncOptions()),
    TestModule,
    RoomModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
