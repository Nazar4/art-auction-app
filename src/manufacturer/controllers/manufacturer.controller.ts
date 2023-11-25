import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { SortType } from 'src/shared/type-utils/global.types';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { Manufacturer } from '../entities/manufacturer.entity';
import { ManufacturerService } from '../services/manufacturer.service';

@Controller('manufacturers')
export class ManufacturerController {
  private readonly logger = new Logger(ManufacturerController.name);

  constructor(private readonly manufacturerService: ManufacturerService) {}

  // @Get()
  // @UseGuards(AuthGuardJwt)
  // public async getAll(): Promise<User[]> {
  //   return await this.manufacturerService.getAll();
  // }

  @Post()
  @UsePipes(new ValidationPipe())
  public async registerManufacturer(
    @Body() createUserDto: CreateUserDto,
  ): Promise<string> {
    return await this.manufacturerService.createManufacturer(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuardJwt)
  public async getManufacturersSortedByAverageRating(
    @Query('sortType') sortType: SortType,
  ): Promise<Manufacturer[]> {
    return await this.manufacturerService.getManufacturersSortedByAverageRating(
      sortType,
    );
  }

  @Get(':id')
  public async getManufacturerByUserId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Manufacturer> {
    return await this.manufacturerService.getManufacturerByUserId(id);
  }
}
