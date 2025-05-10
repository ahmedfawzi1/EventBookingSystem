import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/users/entities/users.entity';
import { CreateEventsDto } from './dtos/create-events.dto';
import { UpdateEventsDto } from './dtos/update-event.dto';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';


export const storage = {
    storage: diskStorage({
        destination: './uploads/eventsImages',
        filename: (_req, file, cb) => {
            const fileName: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const ext: string = path.parse(file.originalname).ext;
            cb(null, `${fileName}${ext}`);
        }
    })
}

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    @UseInterceptors(FileInterceptor('file', storage))
    create(@Body() createEventsDto: CreateEventsDto, @UploadedFile() file: Express.Multer.File) {
        const imagePath = file ? `/uploads/eventsImages/${file.filename}` : undefined;
        const eventData = { ...createEventsDto, image: imagePath };
        return this.eventsService.create(eventData);
    }

    // @Roles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    findAll() {
        return this.eventsService.findAll();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.eventsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateEventsDto: UpdateEventsDto) {
        return this.eventsService.update(Number(id), updateEventsDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.eventsService.remove(Number(id));
    }
}
