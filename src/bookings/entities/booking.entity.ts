import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Event } from 'src/events/entities/events.entity';

@Entity()
export class Bookings {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, (user) => user.bookings, { eager: true })
  user:Promise<Users>;

  @ManyToOne(() => Event, (event) => event.bookings, { eager: true })
  event: Promise<Event>;

  @CreateDateColumn()
  createdAt: Date;
}

