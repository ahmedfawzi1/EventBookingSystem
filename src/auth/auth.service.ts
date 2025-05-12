import { LoginDto } from './dtos/login.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dtos/register.dto';
import { Users } from 'src/users/entities/users.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly i18n: I18nService
  ) { }

  async register(registerDto: RegisterDto) {

    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new UnauthorizedException(
        await this.i18n.translate('auth.user_exists', { lang: I18nContext.current()!.lang })
      );
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    registerDto.password = hashedPassword;

    return this.usersService.create(registerDto);
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);

      const isValidPassword = user && await bcrypt.compare(loginDto.password, user.password);

      if (!isValidPassword) {
        throw new UnauthorizedException(
          this.i18n.t('auth.invalid_credentials', { lang: I18nContext.current()!.lang })
        );
      }

      const payload = { sub: user.id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }

  }

  async refreshToken(user: Users) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

}
