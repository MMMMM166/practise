import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@auth/guards/jwt-auth.guard';
import { Public } from '@auth/public';

import { User } from '@prisma/client';
import { AuthService } from '@auth/auth.service';

@Controller('test-auth')
export class TestController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Публичный эндпоинт - доступен без авторизации
   * Проверяет работу декоратора @Public()
   */
  @Public()
  @Get('public')
  publicEndpoint() {
    return { message: 'Это публичный эндпоинт - доступ разрешен без токена' };
  }

  /**
   * Защищенный эндпоинт - требует валидный JWT токен
   * Проверяет работу JwtAuthGuard
   */
  @UseGuards(AuthGuard)
  @Get('protected')
  protectedEndpoint(@Request() req) {
    return { 
      message: 'Это защищенный эндпоинт - доступ разрешен только с токеном',
      user: req.user // Информация из JWT токена
    };
  }

  /**
   * Эндпоинт для теста refresh токенов
   * Генерирует тестовые токены для проверки
   */
  @Public()
  @Post('generate-test-tokens')
  async generateTestTokens(@Request() req) {
    // Тестовый пользователь (в реальном приложении нужно получать из БД)
    const testUser: User = {
      id: 'test-user-id',
      userName: 'testuser',
      email: 'test@example.com',
      password: 'hashed_password', // В реальном приложении должно быть хешированным
      role: ['USER'],
      wins: 0,
      losses: 0,
      draws: 0,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };

    // Генерируем токены
    const tokens = await this.authService.generateTokens(testUser);
    
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken.token,
      expires: tokens.refreshToken.expires
    };
  }
}