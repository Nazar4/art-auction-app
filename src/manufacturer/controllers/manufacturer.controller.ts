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
import { AuthService } from 'src/auth/services/auth.service';
import { ManufacturerService } from '../services/manufacturer.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { SortType } from 'src/type-utils/global.types';
import { Manufacturer } from '../entities/manufacturer.entity';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';

@Controller('manufacturers')
export class ManufacturerController {
  private readonly logger = new Logger(ManufacturerController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly manufacturerService: ManufacturerService,
  ) {}

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
