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
  // @UsePipes(new ValidationPipe({transform: true}))
  public async getAddressById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Address | undefined> {
    return await this.addressService.getAddressById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt)
  public async createAddress(
    @Body() address: CreateAddressDTO,
  ): Promise<Address> {
    return await this.addressService.createAddress(address);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  public async udpateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateAddressDTO,
  ): Promise<Address> {
    const address = await this.addressService.getAddressById(id);

    if (!address) {
      this.logger.log(
        `/addresses/${id} patch, Message: Could not find address`,
      );
      throw new NotFoundException();
    }

    return await this.addressService.updateAddress(input, address);
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
      this.logger.log(`/addresses/${id} delete, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }
}
