import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  public async getProductsByManufacturerId(
    @Query('manufacturerId', ParseIntPipe) id: number,
  ): Promise<Product[]> {
    return await this.productService.getProductsForManufacturer(id);
  }

  @Get(':id')
  public async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    return await this.productService.getProductById(id);
  }
}
