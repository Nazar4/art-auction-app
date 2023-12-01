import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '../entities/auction.entity';
import { LessThanOrEqual, QueryRunner, Repository } from 'typeorm';

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

  public async finishAuction(auction: Auction): Promise<Auction> {
    auction.auctionFinished = true;
    return await this.auctionRepository.save(auction);
  }

  public async findAllFinishedAuctions(): Promise<Auction[]> {
    const finishedAuctions = await this.auctionRepository.find({
      where: {
        endDate: LessThanOrEqual(new Date()),
      },
    });

    return finishedAuctions;
  }
}
