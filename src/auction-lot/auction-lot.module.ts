import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionLot } from './entities/auction-lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuctionLot])],
})
export class AuctionLotModule {}
