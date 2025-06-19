import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Request,
  Post,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './public';
import { Response } from 'express';
import { Cookies } from '@decorators/cookies.decorator';
import { ConfigService } from '@nestjs/config';
import { getCookieOptions } from '@utils/cookie-options.util';
import { AuthGuard } from './guards/jwt-auth.guard';

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

@Public()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const createdUser = this.authService.register(registerDto);

    if (!createdUser) {
      const textError = 'Ошибка при создании пользователя';
      this.logger.error(textError);
      throw new BadRequestException(textError);
    }

    return createdUser;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const tokens = await this.authService.login(loginDto);

    if (!tokens) {
      const textError = 'Ошибка при попытке входа';
      this.logger.error(textError);
      throw new BadRequestException(textError);
    }

    this.authService.setRefreshTokenToCookies(tokens, res);
  }

  @Get('logout')
  async logout(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response
  ) {
    if (!refreshToken) {
      res.sendStatus(HttpStatus.OK);
      return;
    }

    this.authService.deleteRefreshToken(refreshToken);

    const refreshTokenName = this.configService.get('REFRESH_TOKEN');
    const today = new Date();

    res.cookie(refreshTokenName, '', getCookieOptions(today));
    res.sendStatus(HttpStatus.OK);

    
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

@Public()
@Controller('token')
export class TokenController {
  // Внедрение зависимости TokenService через конструктор
  constructor(private readonly authServise: AuthService) {}

  /**
   * Эндпоинт для обновления пары токенов (access + refresh)
   * @param refreshToken - refresh token из кук (извлекается через @Cookies декоратор)
   * @param res - объект Response из Express для работы с куками
   * @throws UnauthorizedException - если refresh token отсутствует или невалиден
   */
  @Get('refresh-tokens')
  async refreshTokens(
    @Cookies(REFRESH_TOKEN) refreshToken: string,
    @Res() res: Response
  ) {

    if (!refreshToken) {
      throw new UnauthorizedException();
    }


    const tokens = await this.authServise.refreshTokens(refreshToken);

 
    if (!tokens) {
      throw new UnauthorizedException();
    }

 
    this.authServise.setRefreshTokenToCookies(tokens, res);
  }
}