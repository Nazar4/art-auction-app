import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManufacturerService } from 'src/manufacturer/services/manufacturer.service';
import { SortType } from 'src/shared/type-utils/global.types';
import { User } from 'src/user/entities/user.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { Product } from '../entities/product.entity';
import { join } from 'path';
import { writeFile } from 'fs/promises';
import { Manufacturer } from 'src/manufacturer/entities/manufacturer.entity';
import { IllegalArgumentException } from 'src/shared/exceptions/IllegalArgumentException';
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
    return await this.getProductBaseQuery()
      .where('p.id = :id', { id })
      .getOneOrFail();
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
    { originalname, buffer }: Express.Multer.File,
    { id }: User,
  ): Promise<number> {
    let manufacturer: Manufacturer;
    try {
      manufacturer = await this.manufacturerService.getManufacturerByUserId(id);
    } catch (error) {
      throw new IllegalArgumentException(
        `Invalid manufacturer id: ${id} parameter provided`,
      );
    }

    const fileName = `product_${Date.now()}_${originalname}`;
    const filePath = join(process.env.FILE_UPLOAD_PATH, fileName);

    await writeFile(filePath, buffer);

    const product = new Product({
      ...createProductDTO,
      creator: manufacturer,
      photoFilePath: fileName,
    });
    product.calculatePercentageFeeForProductPrice();
    await this.productRepository.save(product);
    return product.percentageFee;
  }
}
