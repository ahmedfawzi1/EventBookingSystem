import { Event } from 'src/events/entities/events.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Bookings } from './entities/booking.entity';
import { BookingResponseDto } from './dtos/booking-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Bookings) private readonly bookingRepository: Repository<Bookings>,
    @InjectRepository(Event) private readonly EventsRepository: Repository<Event>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
  ) { }

  async bookEvent(userId: number, eventId: number): Promise<Bookings> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const event = await this.EventsRepository.findOne({ where: { id: eventId } });

    if (!user || !event) throw new NotFoundException('User or Event not found');

    const existingBooking = await this.bookingRepository.findOne({
      where: { user: { id: userId }, event: { id: eventId } },
    });

    if (existingBooking) throw new BadRequestException('Already booked this event');

    const booking = this.bookingRepository.create({
      user: Promise.resolve(user),
      event: Promise.resolve(event)
    });
    return this.bookingRepository.save(booking);
  }

  async getUserBookings(userId: number): Promise<BookingResponseDto[]> {

    const bookings = await this.bookingRepository.find({ where: { user: { id: userId } }, relations: ['event'] });

    return plainToInstance(BookingResponseDto, bookings, {
      excludeExtraneousValues: true,
    });
  }

}
