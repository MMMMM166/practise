import { MatchPasswordsConstraint } from '@auth/validators/match-passwords-constraint';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { IsStrongPassword, MinLength, Validate } from 'class-validator';

export class RegisterDto extends CreateUserDto {

}
