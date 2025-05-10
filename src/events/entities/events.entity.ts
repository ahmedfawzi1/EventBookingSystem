import { Bookings } from 'src/bookings/entities/booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Untitled Event' })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  category: string;

  // @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Column({ type: 'timestamp', nullable: true })
  date: Date;

  @Column({ nullable: true })
  venue: string;

  @Column('decimal',{ nullable: true })
  price: number;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => Bookings, (booking) => booking.event)
  bookings: Bookings[];
}
