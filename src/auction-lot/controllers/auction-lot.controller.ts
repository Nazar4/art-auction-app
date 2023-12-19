import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuctionLotService } from '../services/auction-lot.service';
import { AuctionLot } from '../entities/auction-lot.entity';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { CreateAuctionLotDTO } from '../dtos/create-auction-lot.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { Constants } from 'src/shared/type-utils/global.constants';
import { ParseOptionalBoolPipe } from 'src/shared/pipes/parse-optional-boolean.pipe';

@Controller('auction-lots')
@UseInterceptors(ClassSerializerInterceptor)
export class AuctionLotController {
  private readonly logger = new Logger(AuctionLotController.name);
  constructor(private readonly auctionLotService: AuctionLotService) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  public getAllActiveAuctionLots(
    @Query('with-dates', ParseOptionalBoolPipe) withDates: boolean,
  ): Promise<AuctionLot[]> {
    return this.auctionLotService.getAllActiveAuctionLots(withDates);
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  public getAuctionLotById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuctionLot> {
    try {
      4;
      return this.auctionLotService.getAuctionLotById(id);
    } catch (error) {
      this.logger.warn(`/auction-lots/${id} GET, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.MANUFACTURER_ROLE)
  public async createAuctionLot(
    @Body()
    createAuctionLotDTO: CreateAuctionLotDTO,
  ): Promise<AuctionLot> {
    try {
      return await this.auctionLotService.createAuctionLot(createAuctionLotDTO);
    } catch (error) {
      this.logger.warn(`/auction-lots POST, Message: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
