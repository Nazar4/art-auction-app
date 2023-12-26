import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
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
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { SortType } from 'src/shared/type-utils/global.types';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { Manufacturer } from '../entities/manufacturer.entity';
import { ManufacturerService } from '../services/manufacturer.service';
import { EntityNotFoundExceptionFilter } from 'src/shared/exceptions/filters/entity-not-found-exception.filter';

@Controller('manufacturers')
export class ManufacturerController {
  private readonly logger = new Logger(ManufacturerController.name);

  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  public registerManufacturer(
    @Body() createUserDto: CreateUserDto,
  ): Promise<string> {
    return this.manufacturerService.createManufacturer(createUserDto);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  public getManufacturersSortedByAverageRating(
    @Query('sortType') sortType: SortType,
  ): Promise<Manufacturer[]> {
    return this.manufacturerService.getManufacturersSortedByAverageRating(
      sortType,
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseFilters(EntityNotFoundExceptionFilter)
  public getManufacturerByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Manufacturer> {
    return this.manufacturerService.getManufacturerByUserId(id);
  }
}
