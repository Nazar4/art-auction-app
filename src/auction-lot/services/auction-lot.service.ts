import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from 'src/auction/entities/auction.entity';
import { AuctionService } from 'src/auction/services/auction.service';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/services/product.service';
import { QueryRunner, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateAuctionLotDTO } from '../dtos/create-auction-lot.dto';
import { AuctionLot } from '../entities/auction-lot.entity';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { IllegalArgumentException } from 'src/shared/exceptions/IllegalArgumentException';

export class AuctionLotService {
  private readonly logger = new Logger(AuctionLotService.name);

  constructor(
    @InjectRepository(AuctionLot)
    private readonly auctionLotRepository: Repository<AuctionLot>,
    private readonly auctionService: AuctionService,
    private readonly productService: ProductService
  ) {}

  private getAuctionLotBaseQuery(): SelectQueryBuilder<AuctionLot> {
    return this.auctionLotRepository.createQueryBuilder('al');
  }

  //   public async getTopBetForAuctionLot

  public async saveAuctionLot(auctiolLot: AuctionLot): Promise<void> {
    await this.auctionLotRepository.save(auctiolLot);
  }

  public async getAuctionLotById(id: number): Promise<AuctionLot> {
    return await this.getAuctionLotBaseQuery()
      .leftJoinAndSelect('al.winner', 'winner')
      .leftJoinAndSelect('al.product', 'product')
      .leftJoinAndSelect('al.auction', 'auction')
      .where('al.id = :id', { id })
      .getOneOrFail();
  }

  public async getAuctionLotByIdWithAuction(id: number): Promise<AuctionLot> {
    return await this.getAuctionLotBaseQuery()
      .leftJoinAndSelect('al.auction', 'auction')
      .where('al.id = :id', { id })
      .getOneOrFail();
  }

  public async getAllActiveAuctionLots(
    withDates: boolean
  ): Promise<AuctionLot[]> {
    const query = this.getAuctionLotBaseQuery()
      .leftJoinAndSelect('al.product', 'product')
      .where('al.winner IS NULL');

    if (withDates) {
      query.leftJoinAndSelect('al.auction', 'auction');
    }

    return query.getMany();
  }

  public async createAuctionLot({
    startDate,
    endDate,
    initialPrice,
    productId
  }: CreateAuctionLotDTO): Promise<AuctionLot> {
    let auction: Auction;
    let product: Product;

    try {
      product = await this.productService.getProductById(productId);
    } catch (error) {
      this.logger.warn(error.message);
      throw new IllegalArgumentException(
        `Product with id: ${productId} was not found`
      );
    }

    auction = await this.auctionService.createAuction(startDate, endDate);

    return await this.auctionLotRepository.save(
      new AuctionLot({ initialPrice, product, auction })
    );
  }

  public async getAuctionLotByAuctionId(id: number): Promise<AuctionLot> {
    return await this.getAuctionLotBaseQuery()
      .innerJoinAndSelect('al.product', 'product')
      .innerJoinAndSelect('product.creator', 'manufacturer')
      .innerJoinAndSelect('manufacturer.user', 'user')
      .innerJoinAndSelect('user.moneyAccount', 'moneyAccount')
      .where('al.auction_id = :id', { id })
      .getOneOrFail();
  }
}
