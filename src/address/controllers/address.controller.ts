import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAddressDTO } from '../dtos/create-address.dto';
import { UpdateAddressDTO } from '../dtos/update-address.dto';
import { Address } from '../entities/address.entity';
import { AddressService } from '../services/address.service';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';

@Controller('addresses')
@UseInterceptors(ClassSerializerInterceptor)
export class AddressController {
  private readonly logger = new Logger(AddressController.name);

  constructor(private readonly addressService: AddressService) {}

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  public async getAddressById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Address> {
    try {
      return await this.addressService.getAddressById(id);
    } catch (error) {
      this.logger.warn(`/addresses/${id} GET, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt)
  @HttpCode(201)
  public async createAddress(
    @Body() address: CreateAddressDTO,
  ): Promise<Address> {
    return await this.addressService.createAddress(address);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt)
  public async udpateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateAddressDTO,
  ): Promise<Address> {
    try {
      return await this.addressService.updateAddress(input, id);
    } catch (error) {
      this.logger.log(`/addresses/${id} PATCH, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  public async deleteAddress(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      await this.addressService.deleteAddress(id);
    } catch (error) {
      this.logger.log(`/addresses/${id} DELETE, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }
}
