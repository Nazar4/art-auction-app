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

    this.auctionService.finishAuction(auction);

    const auctionLot = await this.auctionLotService.getAuctionLotByAuctionId(
      auction.id,
    );
    const manufacturer = auctionLot.product.creator;

    const entities: any[] = [];

    await this.dataSource.transaction(async (manager) => {
      if (auctionLot.requestsNumber === 0 && !(auctionLot.topBet > 0)) {
        entities.push(manufacturer.user.moneyAccount);
        //need to do this in special service that will handle transactions with payments
        manufacturer.user.moneyAccount.balance -= auctionLot.discardedLotFee;
      } else {
        const request =
          await this.requestService.getRequestByAuctionLotIdAndSum(
            auctionLot.id,
            auctionLot.topBet,
          );
        entities.push(request.user.moneyAccount, request);
        request.user.moneyAccount.balance -= request.sum;
        request.user.moneyAccount.balanceInUse -= request.sum;
        request.success = true;
        auctionLot.winner = request.user;

        entities.push(manufacturer.user.moneyAccount, manufacturer);
        manufacturer.user.moneyAccount.balance += auctionLot.topBet;
        manufacturer.productsSold += 1;
      }

      await Promise.all(entities.map((entity) => manager.save(entity)));

      this.logger.log(`Auction finished successfully. Changes saved.`);

      // this.logger.error(
      //   `Error handling auction finished event: ${error.message}`,
      // );
    });
  }
}
