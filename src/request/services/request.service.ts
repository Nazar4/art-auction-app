import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuctionLotService } from 'src/auction-lot/services/auction-lot.service';
import { MoneyAccountService } from 'src/money-account/services/money-account.service';
import { IllegalStateException } from 'src/shared/exceptions/IllegalStateException';
import { User } from 'src/user/entities/user.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateRequestDTO } from '../dtos/create-request.dto';
import { Request } from '../entities/request.entity';
import { IllegalAccessException } from 'src/shared/exceptions/IllegalAccessException';
import { AuctionLot } from 'src/auction-lot/entities/auction-lot.entity';
import { IllegalArgumentException } from 'src/shared/exceptions/IllegalArgumentException';

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

  public async getRequestById(
    id: number,
    { id: userId }: User,
  ): Promise<Request> {
    return await this.getRequestBaseQuery()
      .where('req.id = :id', { id })
      .andWhere('req.user_id = :userId', { userId })
      .leftJoinAndSelect('req.user', 'user')
      .getOneOrFail();
  }

  public async createRequest(
    user: User,
    { sum, auctionLotId }: CreateRequestDTO,
  ): Promise<Request> {
    let auctionLot: AuctionLot;
    try {
      auctionLot =
        await this.auctionLotService.getAuctionLotByIdWithAuction(auctionLotId);
    } catch (error) {
      throw new IllegalArgumentException(
        `Invalid auction lot id: ${auctionLotId} parameter provided`,
      );
    }

    if (
      !auctionLot ||
      !auctionLot.auction ||
      auctionLot.auction.endDate.getTime() < Date.now()
    ) {
      throw new IllegalStateException(
        'The auction is already finished or the request is invalid.',
      );
    }

    if (await this.userHasRequestForLot(user, auctionLotId)) {
      throw new IllegalStateException('You can not create more than 1 request');
    }

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

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new IllegalStateException(err.message);
    } finally {
      await queryRunner.release();
    }

    if (auctionLot.topBet < sum) {
      auctionLot.topBet = sum;
    }
    auctionLot.requestsNumber++;

    this.auctionLotService.saveAuctionLot(auctionLot);

    console.log('sum', sum);
    let request: Request;
    try {
      request = await this.requestRepository.save(
        new Request({ sum, auctionLot, user }),
      );
    } catch (error) {
      this.logger.warn(error.meesage);
      throw new Error(error.message);
    }
    return request;
  }

  private async userHasRequestForLot(
    { id }: User,
    auctionLotId: number,
  ): Promise<number> {
    return this.getRequestBaseQuery()
      .where('req.user_id = :id', { id })
      .andWhere('req.auction_lot = :auctionLotId', { auctionLotId })
      .getCount();
  }

  public async updateRequest(id: number, sum: number, user: User) {
    const request = await this.getRequestBaseQuery()
      .where('req.id = :id', { id })
      .leftJoinAndSelect('req.auctionLot', 'auction_lot')
      .getOneOrFail();

    const sumDifference = sum - request.sum;
    const wasTopBet = request.auctionLot.topBet === request.sum;

    request.sum = sum;

    try {
      await this.moneyAccountService.encreaseBalanceInUse(
        user.moneyAccount,
        sumDifference,
      );
    } catch (error) {
      throw new IllegalStateException(error.message);
    }

    if (wasTopBet && sumDifference < 0) {
      // The request being updated was previously the top bet and the sum was decreased
      // so need to find new top bet request
      const newTopBetRequest = await this.findNewTopBetRequest(
        request.auctionLot.id,
      );
      request.auctionLot.topBet = newTopBetRequest
        ? newTopBetRequest.sum
        : null;
      this.auctionLotService.saveAuctionLot(request.auctionLot);
    } else if (
      sumDifference > 0 &&
      (!request.auctionLot.topBet || request.auctionLot.topBet < sum)
    ) {
      // The sum increased and now it is new top bet
      request.auctionLot.topBet = sum;
      this.auctionLotService.saveAuctionLot(request.auctionLot);
    }

    await this.requestRepository.save(request);
  }

  public async removeRequest(
    { id, moneyAccount }: User,
    requestId: number,
  ): Promise<void> {
    const request = await this.getRequestBaseQuery()
      .where('req.id = :requestId', { requestId })
      .andWhere('req.user_id = :id', { id })
      .leftJoinAndSelect('req.auctionLot', 'auction_lot')
      .leftJoinAndSelect('auction_lot.auction', 'auction')
      .getOne();

    if (
      !request ||
      !request.auctionLot ||
      request.auctionLot.auction.endDate.getTime() < Date.now()
    ) {
      throw new IllegalStateException(
        'The auction is already finished or the request is invalid.',
      );
    }

    this.moneyAccountService.decreaseBalanceInUse(moneyAccount, request.sum);

    await this.requestRepository.remove(request);

    const topBetRequest = await this.findNewTopBetRequest(
      request.auctionLot.id,
    );

    request.auctionLot.topBet = topBetRequest ? topBetRequest.sum : null;
    request.auctionLot.requestsNumber--;

    await this.auctionLotService.saveAuctionLot(request.auctionLot);
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

  // private async isUserOwnerOfAnRequest(
  //   user: User,
  //   id: number,
  // ): Promise<boolean> {}
}
