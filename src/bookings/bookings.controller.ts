import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BookingsService } from './bookings.service';

@UseGuards(JwtAuthGuard)
@Controller('bookings')
export class BookingsController {

    constructor(private readonly bookingsService: BookingsService) { }

    @Post(':eventId')
    async book(@Param('eventId') eventId: number, @Request() req) {
        return this.bookingsService.bookEvent(req.user.userId, Number(eventId));
    }

    @Get('my-bookings')
    async getMyBookings(@Request() req) {
        return this.bookingsService.getUserBookings(req.user.userId);
    }

}
