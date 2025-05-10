import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/events.entity';
import { Repository } from 'typeorm';
import { CreateEventsDto } from './dtos/create-events.dto';
import { UpdateEventsDto } from './dtos/update-event.dto';

@Injectable()
export class EventsService {
    constructor(@InjectRepository(Event) private readonly eventsRepository: Repository<Event>) { }

    create(createEventsDto: CreateEventsDto) {
        const event = this.eventsRepository.create(createEventsDto);
        // console.log(event);
        return this.eventsRepository.save(event);
    }

    findAll() {
        return this.eventsRepository.find();
    }

    async findOne(id: number) {
        const event = await this.eventsRepository.findOne({ where: { id } });
        if (!event) {
            throw new Error('This Event Not Found!');
        }
        return event;
    }

    async update(id: number, updateEventsDto: UpdateEventsDto) {
        const event = await this.eventsRepository.findOne({ where: { id } });
        return this.eventsRepository.save({ ...event, ...updateEventsDto });
    }

    async remove(id: number) {
        const event = await this.eventsRepository.delete(id);
        if (event.affected === 0) {
            throw new NotFoundException(`Event with ID ${id} not found!`);
          }
      }

}
