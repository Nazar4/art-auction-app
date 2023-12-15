import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ViewColumn,
  ViewEntity,
} from 'typeorm';

@ViewEntity({
  expression: `SELECT product_id AS product, lot_winner AS winner, manufacturer FROM auction_lot 
    LEFT JOIN product ON product.id = auction_lot.product_id`,
})
export class AuctionLotView {
  @ViewColumn()
  product: number;

  @ViewColumn()
  winner: number;

  @ViewColumn()
  manufacturer: number;
}
