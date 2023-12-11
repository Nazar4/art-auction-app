import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';
import { AuctionService } from './auction.service';
import { AuctionLotService } from 'src/auction-lot/services/auction-lot.service';
import { RequestService } from 'src/request/services/request.service';
import { AuctionFinishedEvent } from '../events/auction-finished.event';

@Injectable()
export class AuctionEventService {
  private readonly logger = new Logger(AuctionEventService.name);

  constructor(
    private readonly auctionService: AuctionService,
    private readonly auctionLotService: AuctionLotService,
    private readonly requestService: RequestService,
    private readonly dataSource: DataSource,
  ) {}

  @OnEvent('auction.finished', { async: true, promisify: true })
  private async handleAuctionFinished(event: AuctionFinishedEvent) {
    const auction = event.auction;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      this.auctionService.finishAuction(auction);

      const auctionLot = await this.auctionLotService.getAuctionLotByAuctionId(
        auction.id,
      );
      const manufacturer = auctionLot.product.creator;

      const dataSource: any[] = [];

      if (auctionLot.requestsNumber === 0 && !(auctionLot.topBet > 0)) {
        dataSource.push(manufacturer.user.moneyAccount);
        manufacturer.user.moneyAccount.balance -= auctionLot.discardedLotFee;
      } else {
        const request =
          await this.requestService.getRequestByAuctionLotIdAndSum(
            auctionLot.id,
            auctionLot.topBet,
          );
        dataSource.push(request.user.moneyAccount, request);
        request.user.moneyAccount.balance -= request.sum;
        request.user.moneyAccount.balanceInUse -= request.sum;
        request.success = true;
        auctionLot.winner = request.user;

        dataSource.push(manufacturer.user.moneyAccount, manufacturer);
        manufacturer.user.moneyAccount.balance += auctionLot.topBet;
        manufacturer.productsSold += 1;
      }

      await Promise.all(
        dataSource.map((entity) => queryRunner.manager.save(entity)),
      );

      await queryRunner.commitTransaction();

      this.logger.log(`Auction finished successfully. Changes saved.`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Error handling auction finished event: ${error.message}`,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
