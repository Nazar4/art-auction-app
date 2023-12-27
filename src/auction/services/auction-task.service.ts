import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuctionService } from './auction.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuctionFinishedEvent } from '../events/auction-finished.event';

@Injectable() //probably do not need this as this service will not be injected anywhere
export class AuctionTaskService {
  private readonly logger = new Logger(AuctionTaskService.name);
  constructor(
    private readonly auctionService: AuctionService,
    private readonly events: EventEmitter2
  ) {}

  @Cron('0 8 * * *', { name: 'auctions-finished' })
  private checkForFinishedAuctions() {
    this.auctionService.findAllFinishedAuctions().then((auctions) => {
      this.logger.log(`Found ${auctions.length} auctions to be performed`);
      for (const auction of auctions) {
        this.events.emit('auction.finished', new AuctionFinishedEvent(auction));
        this.logger.log(`Executed event for auction with id: ${auction.id}`);
      }
    });
  }
}
