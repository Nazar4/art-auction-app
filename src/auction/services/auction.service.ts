import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from '../entities/auction.entity';
import { QueryRunner, Repository } from 'typeorm';

export class AuctionService {
  constructor(
    @InjectRepository(Auction)
    private readonly auctionRepository: Repository<Auction>,
  ) {}

  public async createAuction(
    startDate: Date,
    endDate: Date,
    queryRunner?: QueryRunner,
  ): Promise<Auction> {
    if (queryRunner) {
      return await queryRunner.manager.save(
        Auction,
        new Auction({ startDate, endDate }),
      );
    }
    return await this.auctionRepository.save(
      new Auction({ startDate, endDate }),
    );
  }

  public async finishAuction(auction: Auction): Promise<Auction> {
    auction.auctionFinished = true;
    return await this.auctionRepository.save(auction);
  }
}
