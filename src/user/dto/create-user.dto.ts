import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail(
    {},
    {
      message: 'Введите email корректно',
    }
  )
  email: string;

  @IsStrongPassword(
    {},
    {
      message:
        'Пароль должен содержать цифры, заглавные и строчные буквы, а также специальные символы',
    }
  )
  @MinLength(8, { message: 'Пароль должен содержать минимум 8 символов' })
  password: string;

  @IsString({ message: 'Псевдоним должен быть строкой' })
  @Length(2, 20, {
    message: 'Длина псевдонима должна быть от 2 до 20 символов',
  })
  userName: string;


}
