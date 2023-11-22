import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { Constants } from 'src/type-utils/global.constants';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { groupBy } from 'rxjs';
import { SortType } from 'src/type-utils/global.types';
import { User } from 'src/user/entities/user.entity';
import { ManufacturerService } from 'src/manufacturer/services/manufacturer.service';
import { NotFoundException } from '@nestjs/common';
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly manufacturerService: ManufacturerService,
  ) {}

  private getProductBaseQuery(): SelectQueryBuilder<Product> {
    return this.productRepository.createQueryBuilder('p');
  }

  public async getProductById(id: number): Promise<Product> {
    return await this.productRepository.findOneBy({ id });
  }

  //need to add pagination and make it decent
  public async getProductsSortedByName(sortType: SortType): Promise<Product[]> {
    return await this.getProductBaseQuery()
      .orderBy('p.name', sortType)
      .getMany();
  }

  //need to add pagination and make it decent
  public async getProductsSortedByPrice(
    sortType: SortType,
  ): Promise<Product[]> {
    return await this.getProductBaseQuery()
      .orderBy('p.price', sortType)
      .getMany();
  }

  public async getProductsForManufacturer(
    manufacturerId: number,
  ): Promise<Product[]> {
    return await this.getProductBaseQuery()
      .where('p.manufacturer = :manufacturerId', { manufacturerId })
      .getMany();
  }

  public async createProduct(
    createProductDTO: CreateProductDTO,
    pictureBuffer: Buffer,
    { id }: User,
  ): Promise<number> {
    const manufacturer =
      await this.manufacturerService.getManufacturerByUserId(id);
    if (!manufacturer) {
      throw new NotFoundException(`Manufacturer with id ${id} was not found`);
    }
    const product = new Product({
      ...createProductDTO,
      creator: manufacturer,
      photoFilePath: pictureBuffer,
    });
    product.percentageFee = this.calculatePercentageFeeForProductPrice(
      product.price,
    );
    await this.productRepository.save(product);
    return product.percentageFee;
  }

  public async uploadProductPictureByProductId(
    id: number,
    fileBuffer: Buffer,
  ): Promise<void> {
    const product = await this.productRepository.findOneByOrFail({ id });
    product.photoFilePath = fileBuffer;
    await this.productRepository.save(product);
  }

  private calculatePercentageFeeForProductPrice(productPrice: number): number {
    const percentageFee = productPrice * 0.01;

    const isBelowLowerBound = percentageFee < Constants.LOWER_BOUND;
    const isAboveUpperBound = percentageFee > Constants.UPPER_BOUND;

    if (isBelowLowerBound) {
      return percentageFee;
    } else if (isAboveUpperBound) {
      return 10000;
    } else {
      return Constants.LOWER_BOUND;
    }
  }
}
