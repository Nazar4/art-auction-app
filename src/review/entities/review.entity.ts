import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { ColumnNumericTransformer } from 'src/shared/transformers/column-numeric.transformer';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

@Entity({ name: 'review' })
@Unique(['reviewer', 'manufacturer'])
// @Index(['reviewer', 'manufacturer'], { unique: true })
export class Review {
  constructor(partial?: Partial<Review>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    precision: 2,
    scale: 1,
    nullable: true
  })
  rating: number;

  @Column({ name: 'review_text', type: 'text' })
  reviewText: string;

  @ManyToOne(() => User, { eager: false, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  reviewer: User;

  @ManyToOne(() => Manufacturer, { eager: false, nullable: false })
  @JoinColumn({ name: 'manufacturer_id', referencedColumnName: 'id' })
  manufacturer: Manufacturer;
}
