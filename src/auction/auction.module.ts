import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { AuctionService } from './services/auction.service';
import { AuctionTaskService } from './services/auction-task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auction])],
  providers: [AuctionService, AuctionTaskService],
  exports: [AuctionService]
})
export class AuctionModule {}
