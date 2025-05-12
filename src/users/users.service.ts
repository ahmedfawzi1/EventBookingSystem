import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users, UserRole } from './entities/users.entity';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        private readonly i18n: I18nService
    ) { }

    async create(userData: RegisterDto) {
        const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new BadRequestException(
                await this.i18n.translate('auth.user_exists', { lang: I18nContext.current()?.lang })
            )
        }

        const newUser = this.usersRepository.create({
            email: userData.email,
            password: userData.password,
            role: userData.role,
        });

        return this.usersRepository.save(newUser);
    }

    async findAll(): Promise<Partial<Users>[]> {
        const users = await this.usersRepository.find();
        return users.map(({ password, ...result }) => result)
    }

    async findById(id: number): Promise<Users> {
        const user = await this.usersRepository.findOne({ where: { id: Number(id) } });
        if (!user) {
            throw new NotFoundException(
                await this.i18n.translate('users.not_found', { lang: I18nContext.current()?.lang })
            );
        }
        return user;
    }

    async findByEmail(email: string): Promise<Users | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async updateUser(id: number, updateData: UpdateUserDto): Promise<Users> {
        await this.usersRepository.update(id, updateData);
        return this.findById(id);
    }

    async deleteUser(id: number): Promise<void> {
        const DeleteUser = await this.findById(id);
        if (!DeleteUser) {
            throw new NotFoundException(
                await this.i18n.translate('users.not_found', { lang: I18nContext.current()?.lang })
            );
        }
        await this.usersRepository.delete(id);
    }
}
