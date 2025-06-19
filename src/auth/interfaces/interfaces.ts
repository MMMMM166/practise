// // Импорт типа Role из клиента Prisma (ORM для работы с базой данных)
import { Role } from '@prisma/client';
import { Token } from '@prisma/client';

/**
 * Интерфейс, описывающий структуру Access Token'а.
 * Содержит основные данные пользователя, которые будут храниться в JWT токене.
 */
export interface IAccessToken {
  userId: string;      // Уникальный идентификатор пользователя
  userName: string;    // Имя пользователя
  email: string;       // Электронная почта пользователя
  role: Role[];        // Массив ролей пользователя (тип Role импортирован из Prisma)
}

/**
 * Тип JWTPayload, который является псевдонимом для IAccessToken.
 * Используется для указания структуры данных, которые будут закодированы в JWT.
 */
export type JWTPayload = IAccessToken;


export interface ITokens {
  accessToken: string;
  refreshToken: Token;
}

export interface ICookieOptions {
  httpOnly: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  secure: boolean;
  path: string;
  expires: Date;
}
