import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { Constants } from 'src/type-utils/global.constants';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { groupBy } from 'rxjs';
import { SortType } from 'src/type-utils/global.types';
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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
    manufacturer: Manufacturer,
  ): Promise<number> {
    const product = new Product({ ...createProductDTO, creator: manufacturer });
    product.percentageFee = this.calculatePercentageFeeForProductPrice(
      product.price,
    );
    await this.productRepository.save(product);
    return product.percentageFee;
  }

  private calculatePercentageFeeForProductPrice(productPrice: number): number {
    let fee = productPrice * 0.01;
    return fee < Constants.UPPER_LEVEL && fee > Constants.BOTTOM_LEVEL
      ? fee
      : fee > Constants.UPPER_LEVEL
      ? 10000
      : Constants.BOTTOM_LEVEL;
  }
}
