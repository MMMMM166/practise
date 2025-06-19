import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,PassportModule,ConfigModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  
  providers: [AuthService,  AuthGuard,
    { provide: APP_GUARD, useClass: AuthGuard },],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}