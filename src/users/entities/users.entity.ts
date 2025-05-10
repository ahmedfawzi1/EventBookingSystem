import { Bookings } from 'src/bookings/entities/booking.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}


@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'varchar', default: 'user' })
  role: UserRole;

  @Column({ nullable: true })
  refreshToken?: string;

  @OneToMany(() => Bookings, (booking) => booking.user) 
  bookings: Promise<Bookings[]>;

}
