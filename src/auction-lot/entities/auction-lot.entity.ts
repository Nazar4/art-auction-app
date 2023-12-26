import { Exclude, Transform } from 'class-transformer';
import { Auction } from 'src/auction/entities/auction.entity';
import { Product } from 'src/product/entities/product.entity';
import { ColumnNumericTransformer } from 'src/shared/transformers/column-numeric.transformer';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'auction_lot' })
@Unique(['auction'])
export class AuctionLot {
  constructor(partial?: Partial<AuctionLot>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'requests_number', default: 0 })
  requestsNumber: number;

  @Column({
    name: 'top_bet',
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    precision: 10,
    scale: 2,
    nullable: true,
  })
  topBet: number;

  @Column({
    name: 'initial_price',
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    precision: 10,
    scale: 2,
  })
  initialPrice: number;

  @Exclude()
  @Column({
    name: 'discarded_lot_fee',
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    precision: 10,
    scale: 2,
    default: 1500,
  })
  discardedLotFee: number;

  @ManyToOne(() => Product, { eager: true, nullable: false })
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Product;

  @Transform(({ value }) => value?.username)
  @ManyToOne(() => User, { eager: false, nullable: true })
  @JoinColumn({ name: 'lot_winner', referencedColumnName: 'id' })
  winner: User;

  @OneToOne(() => Auction, { eager: true, nullable: false })
  @JoinColumn({ name: 'auction_id', referencedColumnName: 'id' })
  auction: Auction;
}
