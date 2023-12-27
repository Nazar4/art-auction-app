import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuctionLot } from './entities/auction-lot.entity';
import { AuctionLotService } from './services/auction-lot.service';
import { AuctionLotController } from './controllers/auction-lot.controller';
import { AuctionModule } from 'src/auction/auction.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuctionLot]),
    AuctionModule,
    ProductModule
  ],
  providers: [AuctionLotService],
  controllers: [AuctionLotController],
  exports: [AuctionLotService]
})
export class AuctionLotModule {}
