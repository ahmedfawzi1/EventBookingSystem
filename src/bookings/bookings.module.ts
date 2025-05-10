import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Bookings } from './entities/booking.entity';
import { Event } from 'src/events/entities/events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookings, Event, Users])],
  providers: [BookingsService],
  controllers: [BookingsController]
})
export class BookingsModule {}
