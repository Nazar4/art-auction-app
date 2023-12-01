import { Auction } from '../entities/auction.entity';
import { AuctionLot } from '../../auction-lot/entities/auction-lot.entity';

export class AuctionFinishedEvent {
  constructor(
    public auction: Auction,
  ) // public auctionLot: AuctionLot, //not sure about this
  {}
}
