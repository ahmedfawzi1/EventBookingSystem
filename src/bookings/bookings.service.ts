import { Event } from 'src/events/entities/events.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { Bookings } from './entities/booking.entity';
import { BookingResponseDto } from './dtos/booking-response.dto';
import { plainToInstance } from 'class-transformer';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Bookings) private readonly bookingRepository: Repository<Bookings>,
    @InjectRepository(Event) private readonly EventsRepository: Repository<Event>,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    private readonly i18n: I18nService
  ) { }

  async bookEvent(userId: number, eventId: number): Promise<Bookings> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const event = await this.EventsRepository.findOne({ where: { id: eventId } });

    if (!user || !event)
      throw new NotFoundException(
        await this.i18n.translate('bookings.not_found', { lang: I18nContext.current()?.lang }));

    const existingBooking = await this.bookingRepository.findOne({
      where: { user: { id: userId }, event: { id: eventId } },
    });

    if (existingBooking)
      throw new BadRequestException(
        await this.i18n.translate('bookings.already_booked', { lang: I18nContext.current()?.lang })
      );

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
