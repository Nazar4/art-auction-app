import { OnEvent } from '@nestjs/event-emitter';
import { AuctionFinishedEvent } from '../events/auction-finished.event';

export class AuctionEventService {
  constructor() {}

  @OnEvent('auction.finished')
  private handleAuctionFinished(event: AuctionFinishedEvent) {
    // Logic to handle finished auction. Will be done later
  }
}
