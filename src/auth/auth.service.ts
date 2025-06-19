import { HttpStatus, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@user/user.service';
import { LoginDto } from './dto/login.dto';
import { compareSync } from 'bcrypt';
import { Token, User } from '@prisma/client';
import { ITokens } from '@auth/interfaces/interfaces';
import { PrismaService } from '@prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { getCookieOptions } from '@utils/cookie-options.util';
import dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { v4 } from 'uuid';
import { jwtConstants } from './constants';


@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  register(registerDto: RegisterDto): Promise<User> {
    const createUserDto = registerDto;
  

    const createdUser = this.userService.create(createUserDto);

    return createdUser;
  }
   


  async login(loginDto: LoginDto): Promise<ITokens> {
    const { userName, password } = loginDto;

    const user: User = await this.userService
      .findByUsername(userName)
      .catch((err) => {
        this.logger.error(err);
        return null;
      });

    const isPasswordMatch = user && compareSync(password, user?.password);

    if (!user || !isPasswordMatch) {
      const textError = 'Неверные логин или пароль';
      this.logger.error(textError);
      throw new UnauthorizedException(textError);
    }

    return this.generateTokens(user);
  }

  async deleteRefreshToken(refreshToken: string) {
    await this.prismaService.token.delete({ where: { token: refreshToken } });
  }


  /**
   * Обновляет пару токенов (access + refresh)
   * @param refreshToken - текущий refresh token
   * @returns Promise<ITokens> - новая пара токенов
   * @throws UnauthorizedException - если токен не найден или просрочен
   */
  async refreshTokens(refreshToken: string): Promise<ITokens> {
    // Удаляем использованный refresh token из БД
    const token = await this.prismaService.token
      .delete({
        where: { token: refreshToken },
      })
      .catch(() => null);

    // Проверяем срок действия токена
    const today = dayjs();
    const expDate = dayjs(token?.expires);
    const isExpired = expDate.isBefore(today);

    if (!token?.expires || isExpired) {
      throw new UnauthorizedException();
    }

    // Получаем пользователя по ID из токена
    const user = await this.userService.findById(token.userId);

    // Генерируем новую пару токенов
    return this.generateTokens(user);
  }


  generateTokens = async (user: User): Promise<ITokens> => {
    
    const accessToken = this.jwtService.sign({
      userId: user.id,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
    {
    secret: jwtConstants.secret,  
    expiresIn: '150m',
  },
  );
    
 
    const refreshToken: Token = await this.getRefreshToken(user.id);
  
    
    return { accessToken, refreshToken };
  };
  
  /**
   * Создает новый refresh token в БД
   * @param userId - ID пользователя
   * @returns Promise<Token> - созданный refresh token
   */
  private getRefreshToken = async (userId: string): Promise<Token> => {
    const currentDate = dayjs();

    // Получаем настройки срока действия из конфига
    const expirationUnit = this.configService.get('TOKEN_EXPIRATION_UNIT');
    const expirationValue = this.configService.get('TOKEN_EXPIRATION_VALUE');

    // Вычисляем дату истечения токена
    const expireDate = currentDate
      .add(expirationValue, expirationUnit)
      .toDate();

    // Создаем запись в БД
    return await this.prismaService.token.create({ 
      data: {
        token: v4(), // Генерируем случайный UUID
        expires: expireDate,
        userId,
      },
    });
  };

  /**
   * Устанавливает refresh token в куки ответа
   * @param tokens - объект с токенами
   * @param res - объект Response из Express
   * @throws UnauthorizedException - если токены не переданы
   */
  setRefreshTokenToCookies(tokens: ITokens, res: Response) {
    if (!tokens) {
      throw new UnauthorizedException();
    }

    const { token, expires } = tokens.refreshToken;
    const cookieExpDate = dayjs(expires).toDate();

    // Получаем название куки из конфига
    const refreshToken = this.configService.get('REFRESH_TOKEN');

    // Устанавливаем куку с refresh token
    res.cookie(refreshToken, token, getCookieOptions(cookieExpDate));
    
    // Отправляем access token в теле ответа
    res.status(HttpStatus.CREATED).json({ accessToken: tokens.accessToken });
  }
}
