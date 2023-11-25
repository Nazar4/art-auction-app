import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '../entities/auction.entity';
import { Repository } from 'typeorm';

export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
  ) {}

  public async createAuction(startDate: Date, endDate: Date): Promise<Auction> {
    return await this.auctionRepository.save(
      new Auction({ startDate, endDate }),
    );
  }
}
