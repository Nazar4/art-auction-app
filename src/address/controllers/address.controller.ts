import {
  Body,
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateAddressDTO } from '../dtos/create-address.dto';
import { UpdateAddressDTO } from '../dtos/update-address.dto';
import { Address } from '../entities/address.entity';
import { AddressService } from '../services/address.service';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';

@Controller('addresses')
export class AddressController {
  private readonly logger = new Logger(AddressController.name);

  constructor(private readonly addressService: AddressService) {}

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  // @UsePipes(new ValidationPipe({transform: true}))
  // @UseInterceptors(ClassSerializerInterceptor)
  public async getAddressById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Address | undefined> {
    const address = await this.addressService.getAddressById(id);
    return address;
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
  ) {
    const address = await this.addressService.getAddressById(id);

    if (!address) {
      throw new NotFoundException();
    }

    // if (address.organizerId !== user.id) {
    //     throw new ForbiddenException(`Not authorized to modify this event`);
    // }

    return await this.addressService.updateAddress(input, address);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt)
  public async deleteAddress(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    // if (address.organizerId !== user.id) {
    //     throw new ForbiddenException(`Not authorized to modify this event`);
    // }
    try {
      await this.addressService.deleteAddress(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
