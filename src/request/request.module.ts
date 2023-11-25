import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Request } from './entities/request.entity';
import { RequestService } from './services/request.service';
import { RequestController } from './controllers/request.controller';
import { MoneyAccountModule } from 'src/money-account/money-account.module';
import { AuctionLotModule } from 'src/auction-lot/auction-lot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
    MoneyAccountModule,
    AuctionLotModule,
  ],
  providers: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
