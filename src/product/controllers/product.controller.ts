import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  FileTypeValidator,
  Get,
  Logger,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { Constants } from 'src/shared/type-utils/global.constants';
import { User } from 'src/user/entities/user.entity';
import { AuthGuardJwt } from '../../auth/guards/auth-guard.jwt';
import { CreateProductDTO } from '../dtos/create-product.dto';
import { Product } from '../entities/product.entity';
import { ProductService } from '../services/product.service';
import { ParseJSONPipe } from 'src/shared/pipes/parse-json.pipe';

@Controller('products')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productService: ProductService) {}

  //need to add pagination and find all and only if man id given then filter
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  public async getProductsByManufacturerId(
    @Query('manufacturerId', ParseIntPipe) id: number,
  ): Promise<Product[]> {
    return await this.productService.getProductsForManufacturer(id);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  public async getProductById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Product> {
    try {
      return await this.productService.getProductById(id);
    } catch (error) {
      this.logger.log(`/products/${id} GET, Message: ${error.message}`);
      throw new NotFoundException();
    }
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
