import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
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
  ValidationPipe
} from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { ParseOptionalBoolPipe } from 'src/shared/pipes/parse-optional-boolean.pipe';
import { Constants } from 'src/shared/type-utils/global.constants';
import { CreateAuctionLotDTO } from '../dtos/create-auction-lot.dto';
import { AuctionLot } from '../entities/auction-lot.entity';
import { AuctionLotService } from '../services/auction-lot.service';
import { EntityNotFoundExceptionFilter } from 'src/shared/exceptions/filters/entity-not-found-exception.filter';
import { IllegalExceptionFilter } from 'src/shared/exceptions/filters/custom-http-exception.filter';

@Controller('auction-lots')
@UseInterceptors(ClassSerializerInterceptor)
export class AuctionLotController {
  private readonly logger = new Logger(AuctionLotController.name);
  constructor(private readonly auctionLotService: AuctionLotService) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  public getAllActiveAuctionLots(
    @Query('with-dates', ParseOptionalBoolPipe) withDates: boolean
  ): Promise<AuctionLot[]> {
    return this.auctionLotService.getAllActiveAuctionLots(withDates);
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  @UseFilters(EntityNotFoundExceptionFilter)
  public getAuctionLotById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<AuctionLot> {
    return this.auctionLotService.getAuctionLotById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.MANUFACTURER_ROLE)
  @UseFilters(IllegalExceptionFilter)
  public createAuctionLot(
    @Body()
    createAuctionLotDTO: CreateAuctionLotDTO
  ): Promise<AuctionLot> {
    // try {
    return this.auctionLotService.createAuctionLot(createAuctionLotDTO);
    // } catch (error) {
    //   this.logger.warn(`/auction-lots POST, Message: ${error.message}`);
    //   throw new BadRequestException(error.message);
    // }
  }
}
