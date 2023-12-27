import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auction } from '../entities/auction.entity';

export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>
  ) {}

  private getAuctionBaseQuery() {
    return this.auctionRepository.createQueryBuilder('au');
  }

  public async createAuction(startDate: Date, endDate: Date): Promise<Auction> {
    return await this.auctionRepository.save(
      new Auction({ startDate, endDate })
    );
  }

  public async finishAuction(auction: Auction): Promise<Auction> {
    auction.auctionFinished = true;
    return await this.auctionRepository.save(auction);
  }

  public async findAllFinishedAuctions(): Promise<Auction[]> {
    const finishedAuctions = await this.getAuctionBaseQuery()
      .where('au.endDate <= :currentDate', { currentDate: new Date() })
      .getMany();

    return finishedAuctions;
  }
}
