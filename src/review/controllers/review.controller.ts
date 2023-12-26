import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { Constants } from 'src/shared/type-utils/global.constants';
import { User } from 'src/user/entities/user.entity';
import { CreateReviewDTO } from '../dtos/create-review.dto';
import { Review } from '../entities/review.entity';
import { ReviewService } from '../services/review.service';
import { EntityNotFoundExceptionFilter } from 'src/shared/exceptions/filters/entity-not-found-exception.filter';
import { IllegalExceptionFilter } from 'src/shared/exceptions/filters/custom-http-exception.filter';

@Controller('reviews')
export class ReviewController {
  private readonly logger = new Logger(ReviewController.name);

  constructor(private readonly reviewService: ReviewService) {}

  //need to add pagination and find all and only if man id given then filter
  @Get()
  @UseFilters(EntityNotFoundExceptionFilter)
  public getReviewsByManufacturerId(
    @Query('manufacturerId', ParseIntPipe) id: number,
  ): Promise<Review[]> {
    return this.reviewService.getAllReviewsByManufacturerId(id);
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(EntityNotFoundExceptionFilter)
  public getReveiwById(@Param('id', ParseIntPipe) id: number): Promise<Review> {
    return this.reviewService.getReviewById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  @UseFilters(IllegalExceptionFilter)
  @HttpCode(HttpStatus.ACCEPTED)
  public createReveiw(
    @Body() review: CreateReviewDTO,
    @CurrentUser() creator: User,
  ): Promise<Review> {
    return this.reviewService.createReview(review, creator);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  @UseFilters(EntityNotFoundExceptionFilter)
  @HttpCode(HttpStatus.NO_CONTENT)
  public deleteReveiw(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.reviewService.deleteReview(id, user);
  }
}
