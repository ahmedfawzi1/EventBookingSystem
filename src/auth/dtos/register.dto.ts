import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';
import { UserRole } from 'src/users/entities/users.entity';

export class RegisterDto {
  @IsEmail({}, { message: 'validations.email_invalid' })
  email: string;

   @IsNotEmpty({ message: 'validations.required_field' })
  @MinLength(6, { message: 'validations.password_too_short' })
  password: string;

  @IsOptional()
  @IsIn([UserRole.USER, UserRole.ADMIN], { message: 'validations.role_invalid' })
  role?: UserRole;
}

