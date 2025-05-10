import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users, UserRole } from './entities/users.entity';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(Users) private readonly usersRepository: Repository<Users>) { }

    async create(userData: RegisterDto) {
        const existingUser = await this.usersRepository.findOne({ where: { email: userData.email } });
        if (existingUser) {
            throw new Error('User already exists');
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
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<Users | null> {
        return  this.usersRepository.findOne({ where: { email } });
    }

    async updateUser(id: number, updateData: UpdateUserDto): Promise<Users> {
        await this.usersRepository.update(id, updateData);
        return this.findById(id);
    }

    async deleteUser(id:number): Promise<void> {
        const DeleteUser = await this.findById(id);
        if (!DeleteUser) {
            throw new NotFoundException(`User with ID "${id}" not found`);
        }
        await this.usersRepository.delete(id);
    }
}
