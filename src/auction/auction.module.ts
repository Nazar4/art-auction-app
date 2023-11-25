import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { AuctionService } from './services/auction.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auction])],
  providers: [AuctionService],
  exports: [AuctionService],
})
export class AuctionModule {}
