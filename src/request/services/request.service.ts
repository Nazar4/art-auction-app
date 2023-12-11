import { ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLot } from 'src/auction-lot/entities/auction-lot.entity';
import { AuctionLotService } from 'src/auction-lot/services/auction-lot.service';
import { MoneyAccountService } from 'src/money-account/services/money-account.service';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRequestDTO } from '../dtos/create-request.dto';
import { Request } from '../entities/request.entity';

export class RequestService {
  private readonly logger = new Logger(RequestService.name);

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
    if (this.userHasRequestForLot(user, auctionLotId)) {
      throw new Error('You can not create more than 1 request');
    }

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

  private async userHasRequestForLot({ id }: User, auctionLotId: number) {
    this.getRequestBaseQuery()
      .where('req.user_id = :id', { id })
      .andWhere('req.auction_lot = :auctionLotId', { auctionLotId })
      .getCount();
  }

  public async updateRequest(id: number, sum: number, user: User) {
    //need to also check if topBet request was changed and maybe new 1 is topBet
    const request = await this.getRequestBaseQuery()
      .where('req.id = :id', { id })
      .leftJoinAndSelect('req.auctionLot', 'auction_lot')
      .getOne();

    const sumDifference = sum - request.sum;
    request.sum = sum;

    try {
      await this.moneyAccountService.encreaseBalanceInUse(
        user.moneyAccount,
        sumDifference,
      );
    } catch (err) {
      throw new Error(err.message);
    }

    if (sumDifference > 0) {
      if (request.auctionLot.topBet < sum) {
        request.auctionLot.topBet = sum;
      }
      this.auctionLotService.saveAuctionLot(request.auctionLot);
    }

    this.requestRepository.save(request);
  }

  public async removeRequest(
    { id, moneyAccount }: User,
    requestId: number,
  ): Promise<void> {
    //need to also check whether auction was already finished

    const request = await this.getRequestBaseQuery()
      .where('req.id = :requestId', { requestId })
      .andWhere('req.user_id = :id', { id })
      .leftJoinAndSelect('req.auctionLot', 'auction_lot')
      .getOne();

    if (!request) {
      throw new ForbiddenException();
    }

    this.moneyAccountService.decreaseBalanceInUse(moneyAccount, request.sum);

    await this.requestRepository.remove(request);

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
  }

  private async findNewTopBetRequest(
    auctionLotId: number,
  ): Promise<Request | undefined> {
    return await this.getRequestBaseQuery()
      .where('req.auction_lot = :auctionLotId', { auctionLotId })
      .orderBy('req.sum', 'DESC')
      .getOne();
  }

  public async getRequestByAuctionLotIdAndSum(
    auctionLotId: number,
    sum: number,
  ): Promise<Request | undefined> {
    return await this.getRequestBaseQuery()
      .where('req.auction_lot = :auctionLotId', { auctionLotId })
      .innerJoinAndSelect('req.user', 'user')
      .innerJoinAndSelect('user.moneyAccount', 'moneyAccount')
      .andWhere('req.sum = :sum', { sum })
      .getOneOrFail();
  }
}
