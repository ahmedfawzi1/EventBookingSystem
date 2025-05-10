import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from 'class-validator';
import { UserRole } from 'src/users/entities/users.entity';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn([UserRole.USER, UserRole.ADMIN])
  role?: UserRole;
}

