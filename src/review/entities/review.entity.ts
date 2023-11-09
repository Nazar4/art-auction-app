import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'review' })
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  rating: number;

  @Column({ name: 'review_text', type: 'text' })
  reviewText: string;

  @ManyToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  reviewer: User;

  @ManyToOne(() => Manufacturer, { lazy: true, nullable: false })
  @JoinColumn({ name: 'manufacturer_id', referencedColumnName: 'id' })
  manufacturer: Manufacturer;
}
