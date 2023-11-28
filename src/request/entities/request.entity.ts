import { AuctionLot } from 'src/auction-lot/entities/auction-lot.entity';
import { ColumnNumericTransformer } from 'src/shared/transformers/column-numeric.transformer';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'request' })
export class Request {
  constructor(partial?: Partial<Request>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    precision: 10,
    scale: 2,
  })
  sum: number;

  @Column({ default: false })
  success: boolean;

  @ManyToOne(() => User, { eager: false, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => AuctionLot, { eager: false, nullable: false }) //lazy: true had to remove as it works incorrectly
  @JoinColumn({ name: 'auction_lot', referencedColumnName: 'id' })
  auctionLot: AuctionLot;
}
