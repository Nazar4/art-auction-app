import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'manufacturer' })
@Unique(['user'])
export class Manufacturer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'average_rating',
    type: 'decimal',
    precision: 2,
    scale: 1,
    nullable: true,
  })
  averageRating: number;

  @Column({ name: 'products-sold', nullable: true, type: 'int' })
  productsSold: number;

  //   @Column({ name: 'active_until', type: 'datetime' })
  //   activeUntil: Date;

  @OneToOne(() => User, { lazy: true, onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
