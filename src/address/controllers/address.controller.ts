import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CreateAddressDTO } from '../dtos/create-address.dto';
import { UpdateAddressDTO } from '../dtos/update-address.dto';
import { Address } from '../entities/address.entity';
import { AddressService } from '../services/address.service';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { EntityNotFoundExceptionFilter } from 'src/shared/exceptions/filters/entity-not-found-exception.filter';

@Controller('addresses')
@UseInterceptors(ClassSerializerInterceptor)
export class AddressController {
  private readonly logger = new Logger(AddressController.name);

  constructor(private readonly addressService: AddressService) {}

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  @UseFilters(EntityNotFoundExceptionFilter)
  public getAddressById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<Address> {
    return this.addressService.getAddressById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt)
  @HttpCode(HttpStatus.CREATED)
  public createAddress(@Body() address: CreateAddressDTO): Promise<Address> {
    return this.addressService.createAddress(address);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt)
  public async udpateAddress(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateAddressDTO,
    @CurrentUser() user: User
  ): Promise<Address> {
    try {
      return await this.addressService.updateAddress(input, id, user);
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
    @CurrentUser() user: User
  ): Promise<void> {
    try {
      await this.addressService.deleteAddress(id, user);
    } catch (error) {
      this.logger.log(`/addresses/${id} DELETE, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }
}
