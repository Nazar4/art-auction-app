import { InjectRepository } from '@nestjs/typeorm';
import { AuctionService } from 'src/auction/services/auction.service';
import {
  Repository,
  SelectQueryBuilder,
  QueryRunner,
  DataSource,
} from 'typeorm';
import { CreateAuctionLotDTO } from '../dtos/create-auction-lot.dto';
import { AuctionLot } from '../entities/auction-lot.entity';
import { ProductService } from 'src/product/services/product.service';
import { Logger } from '@nestjs/common';
import { Auction } from 'src/auction/entities/auction.entity';
import { Product } from 'src/product/entities/product.entity';

export class AuctionLotService {
  private readonly logger = new Logger(AuctionLotService.name);

  constructor(
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
    private readonly auctionService: AuctionService,
    private readonly productService: ProductService,
    private readonly dataSource: DataSource,
  ) {}

  private getAuctionLotBaseQuery(): SelectQueryBuilder<AuctionLot> {
    return this.auctionLotRepository.createQueryBuilder('al');
  }

  //   public async getTopBetForAuctionLot

  public async saveAuctionLot(auctiolLot: AuctionLot): Promise<void> {
    await this.auctionLotRepository.save(auctiolLot);
  }

  public async getAuctionLotById(
    id: number,
    queryRunner?: QueryRunner,
  ): Promise<AuctionLot | undefined> {
    if (queryRunner) {
      return await queryRunner.manager.findOneByOrFail(AuctionLot, { id });
    }
    return await this.auctionLotRepository.findOneByOrFail({ id });
  }

  public async createAuctionLot({
    startDate,
    endDate,
    initialPrice,
    productId,
  }: CreateAuctionLotDTO): Promise<AuctionLot> {
    console.log(productId);
    let auction: Auction;
    let product: Product;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      auction = await this.auctionService.createAuction(
        startDate,
        endDate,
        queryRunner,
      );
      product = await this.productService.getProductById(
        productId,
        queryRunner,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new Error(err.message);
    } finally {
      await queryRunner.release();
    }
    return await this.auctionLotRepository.save(
      new AuctionLot({ initialPrice, product, auction }),
    );
  }
}
