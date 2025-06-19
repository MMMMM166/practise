// Импорт необходимых модулей и декораторов
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTPayload } from '@auth/interfaces/interfaces';
import { User } from '@prisma/client';
import { UserService } from '@user/user.service';


/**
 * JwtStrategy - стратегия аутентификации через JWT токен
 * Наследует PassportStrategy из @nestjs/passport
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Логгер для вывода информации о работе стратегии
  private readonly logger = new Logger(JwtStrategy.name);

//   /**
//    * Конструктор стратегии
//    * @param configService - сервис для работы с конфигурацией
//    * @param userService - сервис для работы с пользователями
//    */
  constructor(
    configService: ConfigService,
    private readonly userService: UserService
  ) {
    console.log('JWT_SECRET:', configService.get('JWT_SECRET'));
    super({
      // Указываем как извлекать JWT из запроса (из заголовка Authorization как Bearer токен)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // Не игнорируем срок действия токена (будет проверяться)
      ignoreExpiration: false,
      
      // Секретный ключ для верификации подписи токена
      secretOrKey: configService.get('JWT_SECRET'),

      
      
    });
  }

  /**
   * Метод валидации JWT токена
   * @param jwtPayload - распаршенные данные из JWT токена
   * @returns Promise<JWTPayload> - возвращает payload токена если валидация успешна
   * @throws UnauthorizedException - если пользователь не найден
   */
  async validate(jwtPayload: JWTPayload) {
    // Ищем пользователя в базе данных по ID из токена
    const user: User = await this.userService
      .findById(jwtPayload.userId)
      .catch((err) => {
        // Логируем ошибку если что-то пошло не так
        this.logger.error(err);
        return null;
      });

    // Если пользователь не найден - выбрасываем исключение
    if (!user) {
      throw new UnauthorizedException();
    }

    // Возвращаем payload токена (будет доступен в req.user)
    return jwtPayload;
  }

}
