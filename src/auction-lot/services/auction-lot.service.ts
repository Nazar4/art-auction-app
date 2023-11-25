import { InjectRepository } from '@nestjs/typeorm';
import { AuctionService } from 'src/auction/services/auction.service';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateAuctionLotDTO } from '../dtos/create-auction-lot.dto';
import { AuctionLot } from '../entities/auction-lot.entity';
import { ProductService } from 'src/product/services/product.service';

export class AuctionLotService {
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

  public async getAuctionLotById(id: number): Promise<AuctionLot | undefined> {
    return await this.auctionLotRepository.findOneBy({ id });
  }

  public async createAuctionLot({
    startDate,
    endDate,
    initialPrice,
    productId,
  }: CreateAuctionLotDTO): Promise<AuctionLot> {
    const auction = await this.auctionService.createAuction(startDate, endDate);

    const product = await this.productService.getProductById(productId);

    return await this.auctionLotRepository.save(
      new AuctionLot({ initialPrice, product, auction }),
    );
  }
}
