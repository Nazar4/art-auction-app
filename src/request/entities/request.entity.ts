import { AuctionLot } from 'src/auction-lot/entities/auction-lot.entity';
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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  sum: number;

  @Column({ default: false })
  success: boolean;

  @ManyToOne(() => User, { lazy: true, nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => AuctionLot, { lazy: true, nullable: false })
  @JoinColumn({ name: 'auction_lot', referencedColumnName: 'id' })
  auctionLot: AuctionLot;
}
