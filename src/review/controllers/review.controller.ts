import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Review } from '../entities/review.entity';
import { ReviewService } from '../services/review.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';

@Controller('reviews')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(private readonly reviewService: ReviewService) {}

  //need to add pagination and find all and only if man id given then filter
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

  //post additional checks

  //patch not sure

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('user')
  public async deleteReveiw(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      await this.reviewService.deleteReview(id);
    } catch (error) {
      this.logger.log(`/addresses/${id} delete, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }
}
