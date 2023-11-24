import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuardJwt } from '../../auth/guards/auth-guard.jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { Constants } from 'src/type-utils/global.constants';
import { ParseJSONPipe } from './parse-json.pipe';
import { FieldName } from 'src/auth/decorators/parse-json-field-name.decorator';

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

  @Post()
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('manufacturer')
  @UseInterceptors(FileInterceptor('picture'))
  public async createProduct(
    @Body(new ParseJSONPipe('createProductDTO'))
    createProductDTO: CreateProductDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: Constants.MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: Constants.FILE_TYPES }),
        ],
      }),
    )
    picture: Express.Multer.File,
    @CurrentUser() creator: User,
  ): Promise<number> {
    return await this.productService.createProduct(
      createProductDTO,
      picture.buffer,
      creator,
    );
  }

  // @Patch(':id')
  // @UseGuards(AuthGuardJwt, RolesGuard)
  // @Roles('manufacturer')
  // @UseInterceptors(FileInterceptor('picture'))
  // public async uploadPhotoForProduct(
  //   @Param('id', ParseIntPipe) id: number,
  //   @UploadedFile(
  //     new ParseFilePipe({
  //       validators: [
  //         new MaxFileSizeValidator({ maxSize: Constants.MAX_FILE_SIZE }),
  //         new FileTypeValidator({ fileType: Constants.FILE_TYPES }),
  //       ],
  //     }),
  //   )
  //   picture: Express.Multer.File,
  // ) {
  //   this.productService.uploadProductPictureByProductId(id, picture.buffer);
  // }
}
