import { UserRole } from 'src/users/entities/users.entity';
import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users } from './entities/users.entity';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    async findAll(): Promise<Partial<Users>[]> {
        const users = await this.usersService.findAll();
        return users.map(user => {
            const { password, ...rest } = user;
            return rest;
        });
    }

    @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Partial<Users>> {
        try {
            const userIndex = await this.usersService.findById(id);
            const { password, ...result } = userIndex;
            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() userUpdate: UpdateUserDto) {
        return this.usersService.updateUser(Number(id), userUpdate);
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        try {
            this.usersService.deleteUser(Number(id))
        } catch (error) {
            throw new NotFoundException(error.message);
        }
    }
}
