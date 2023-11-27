import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLotService } from 'src/auction-lot/services/auction-lot.service';
import { MoneyAccountService } from 'src/money-account/services/money-account.service';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRequestDTO } from '../dtos/create-request.dto';
import { Request } from '../entities/request.entity';
import { AuctionLot } from 'src/auction-lot/entities/auction-lot.entity';
import { BadRequestException } from '@nestjs/common';

export class RequestService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly auctionLotService: AuctionLotService,
    private readonly moneyAccountService: MoneyAccountService,
    private readonly dataSource: DataSource,
  ) {}

  private getRequestBaseQuery(): SelectQueryBuilder<Request> {
    return this.requestRepository.createQueryBuilder('req');
  }

  public async createRequest(
    user: User,
    { sum, auctionLotId }: CreateRequestDTO,
  ): Promise<Request> {
    let auctionLot: AuctionLot;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //first argument has to be entity to know which table to use
      await this.moneyAccountService.encreaseBalanceInUse(
        user.moneyAccount,
        sum,
        queryRunner,
      );
      auctionLot = await this.auctionLotService.getAuctionLotById(
        auctionLotId,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err.message);
    } finally {
      await queryRunner.release();
    }

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

    const topBetRequest = await this.findNewTopBetRequest(
      request.auctionLot.id,
    );

    if (topBetRequest) {
      request.auctionLot.topBet = topBetRequest.sum;
    } else {
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
      .getOne();
  }
}
