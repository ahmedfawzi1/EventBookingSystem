import { Expose, Type } from 'class-transformer';

export class EventDetails {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  date: Date;

  @Expose()
  venue: string;

  @Expose()
  price: number;

  @Expose()
  image: string;
}

export class BookingResponseDto {
  @Expose()
  id: number;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => EventDetails)
  event: EventDetails;
}
