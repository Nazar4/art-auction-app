import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuctionLotService } from '../services/auction-lot.service';
import { AuctionLot } from '../entities/auction-lot.entity';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { CreateAuctionLotDTO } from '../dtos/create-auction-lot.dto';

@Controller('auction-lots')
export class AuctionLotController {
  private readonly logger = new Logger(AuctionLotController.name);
  constructor(private readonly auctionLotService: AuctionLotService) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  public async getAllActiveAuctionLots(): Promise<AuctionLot[]> {
    return await this.auctionLotService.getAllActiveAuctionLots();
  }

  @Get('/with-dates')
  @UseGuards(AuthGuardJwt)
  public async getAllActiveAuctionLotsWithDates(): Promise<AuctionLot[]> {
    return await this.auctionLotService.getAllActiveAuctionLotsWithDates();
  }

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  public async getAuctionLotById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuctionLot> {
    return await this.auctionLotService.getAuctionLotById(id, null);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt)
  public async createAuctionLot(
    @Body()
    createAuctionLotDTO: CreateAuctionLotDTO,
  ): Promise<AuctionLot> {
    try {
      return await this.auctionLotService.createAuctionLot(createAuctionLotDTO);
    } catch (error) {
      this.logger.warn(`/auction-lots post, Message: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }
}
