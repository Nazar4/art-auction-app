import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from 'src/auction/entities/auction.entity';
import { AuctionService } from 'src/auction/services/auction.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/services/product.service';
import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateAuctionLotDTO } from '../dtos/create-auction-lot.dto';
import { AuctionLot } from '../entities/auction-lot.entity';

export class AuctionLotService {
  private readonly logger = new Logger(AuctionLotService.name);

  constructor(
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
    private readonly auctionService: AuctionService,
    private readonly productService: ProductService,
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

  public async getAllActiveAuctionLots(): Promise<AuctionLot[]> {
    return await this.getAuctionLotBaseQuery()
      .where('al.winner IS NULL')
      .getMany();
  }

  public async getAllActiveAuctionLotsWithDates(): Promise<AuctionLot[]> {
    return await this.getAuctionLotBaseQuery()
      .where('al.winner IS NULL')
      .leftJoinAndSelect('al.auction', 'auction_id')
      .getMany();
  }

  public async createAuctionLot({
    startDate,
    endDate,
    initialPrice,
    productId,
  }: CreateAuctionLotDTO): Promise<AuctionLot> {
    let auction: Auction;
    let product: Product;

    product = await this.productService.getProductById(productId);

    if (!product) {
      throw new Error(`Could not find product with id: ${productId}`);
    }

    auction = await this.auctionService.createAuction(startDate, endDate);

    return await this.auctionLotRepository.save(
      new AuctionLot({ initialPrice, product, auction }),
    );
  }
}
