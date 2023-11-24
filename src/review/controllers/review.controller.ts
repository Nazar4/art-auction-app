import {
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Review } from '../entities/review.entity';
import { ReviewService } from '../services/review.service';

@Controller('reviews')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(private readonly reviewService: ReviewService) {}

  // @Get()
  // @UseGuards(AuthGuardJwt)
  // public async getAll(): Promise<User[]> {
  //   return await this.manufacturerService.getAll();
  // }

  // @Post()
  // @UsePipes(new ValidationPipe())
  // public async registerManufacturer(
  //   @Body() createUserDto: CreateUserDto,
  // ): Promise<string> {
  //   return await this.manufacturerService.createManufacturer(createUserDto);
  // }

  @Get()
  public async getReviewsByManufacturerId(
    @Query('manufacturerId', ParseIntPipe) id: number,
  ): Promise<Review[]> {
    return await this.reviewService.getAllReviewsByManufacturerId(id);
  }

  @Get(':id')
  public async getReveiwById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Review> {
    return await this.reviewService.getReviewById(id);
  }
}
