import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'validations.email_invalid' })
  email: string;

  @IsNotEmpty({ message: 'validations.required_field' })
  @MinLength(6, { message: 'validations.password_too_short' })
  password: string;
}
