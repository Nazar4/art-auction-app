import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLotService } from 'src/auction-lot/services/auction-lot.service';
import { MoneyAccountService } from 'src/money-account/services/money-account.service';
import { User } from 'src/user/entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRequestDTO } from '../dtos/create-request.dto';
import { Request } from '../entities/request.entity';

export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly auctionLotService: AuctionLotService,
    private readonly moneyAccountService: MoneyAccountService,
  ) {}

  private getRequestBaseQuery(): SelectQueryBuilder<Request> {
    return this.requestRepository.createQueryBuilder('req');
  }

  public async createRequest(
    user: User,
    { sum, auctionLotId }: CreateRequestDTO,
  ): Promise<Request> {
    await this.moneyAccountService.encreaseBalanceInUse(user.moneyAccount, sum);

    const auctionLot =
      await this.auctionLotService.getAuctionLotById(auctionLotId);

    if (auctionLot.topBet < sum) {
      auctionLot.topBet = sum;
    }
    auctionLot.requestsNumber++;

    this.auctionLotService.saveAuctionLot(auctionLot);

    const request = await this.requestRepository.save(
      new Request({ sum, auctionLot, user }),
    );

    return request;
  }

  public async removeRequest(
    { moneyAccount }: User,
    requestId: number,
  ): Promise<void> {
    const request = await this.requestRepository.findOneByOrFail({
      id: requestId,
    });

    this.moneyAccountService.decreaseBalanceInUse(moneyAccount, request.sum);

    try {
      const topBetRequest = await this.findNewTopBetRequest(
        request.auctionLot.id,
      );
      request.auctionLot.topBet = topBetRequest.sum;
    } catch (e) {
      request.auctionLot.topBet = null;
    }
    request.auctionLot.requestsNumber--;

    this.auctionLotService.saveAuctionLot(request.auctionLot);

    await this.requestRepository.remove(request);
  }

  private async findNewTopBetRequest(
    auctionLotId: number,
  ): Promise<Request | undefined> {
    return await this.getRequestBaseQuery()
      .where('req.auctionLot = :auctionLotId', { auctionLotId })
      .orderBy('req.sum')
      .getOneOrFail();
  }
}
