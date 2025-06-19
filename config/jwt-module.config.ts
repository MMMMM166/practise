// Импорт необходимых модулей из NestJS и JWT
import { ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';

/**
 * Функция для создания конфигурации JWT модуля.
 * Принимает ConfigService для доступа к переменным окружения.
 * 
 * @param config - Сервис конфигурации NestJS (ConfigService), предоставляющий доступ к env-переменным.
 * @returns Объект конфигурации JWT модуля (JwtModuleOptions) с секретом и настройками подписи.
 */
export const jwtModuleOptions = (config: ConfigService): JwtModuleOptions => ({
  secret: config.get('JWT_SECRET'), // Получает секретный ключ из переменной окружения JWT_SECRET
  signOptions: {
    expiresIn: config.get('JWT_EXPIRES', '5m'), // Время жизни токена (по умолчанию '5m' — 5 минут)
  },
});

/**
 * Асинхронная конфигурация для JWT модуля.
 * Позволяет внедрить зависимости (например, ConfigService) перед созданием конфигурации.
 * 
 * @returns Объект JwtModuleAsyncOptions, который используется для настройки JWT модуля асинхронно.
 */
export const jwtModuleAsyncOptions = (): JwtModuleAsyncOptions => ({
  inject: [ConfigService], // Указывает, что нужно внедрить ConfigService
  useFactory: (config: ConfigService) => jwtModuleOptions(config), // Фабрика, возвращающая конфигурацию JWT
});