import {
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { IllegalStateException } from 'src/shared/exceptions/IllegalStateException';
import { Constants } from 'src/shared/type-utils/global.constants';
import { User } from 'src/user/entities/user.entity';
import { MoneyAccount } from '../entities/money-account.entity';
import { MoneyAccountService } from '../services/money-account.service';
import { EntityNotFoundExceptionFilter } from 'src/shared/exceptions/filters/entity-not-found-exception.filter';
import { IllegalExceptionFilter } from 'src/shared/exceptions/filters/custom-http-exception.filter';

@Controller('money-accounts')
export class MoneyAccountController {
  private readonly logger = new Logger(MoneyAccountController.name);

  constructor(private readonly moneyAccountService: MoneyAccountService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE, Constants.MANUFACTURER_ROLE)
  @UseFilters(IllegalExceptionFilter, EntityNotFoundExceptionFilter)
  public getMoneyAccountById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<MoneyAccount> {
    return this.moneyAccountService.getMoneyAccountById(id, user);
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE, Constants.MANUFACTURER_ROLE)
  @UseFilters(IllegalExceptionFilter, EntityNotFoundExceptionFilter)
  public getMoneyAccountByName(
    @Query('name') name: string,
    @CurrentUser() user: User,
  ): Promise<MoneyAccount> {
    return this.moneyAccountService.getMoneyAccountByName(name, user);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE, Constants.MANUFACTURER_ROLE)
  @UseFilters(IllegalExceptionFilter, EntityNotFoundExceptionFilter)
  public async updateMoneyAccountName(
    @Param('id', ParseIntPipe) id: number,
    @Query('name') name: string,
    @CurrentUser() user: User,
  ): Promise<MoneyAccount> {
    return await this.moneyAccountService.updateMoneyAccountNameById(
      id,
      name,
      user,
    );
  }

  @Post(':id')
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.ADMIN_ROLE)
  @UseFilters(EntityNotFoundExceptionFilter)
  @HttpCode(HttpStatus.OK)
  public blockMoneyAccount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MoneyAccount> {
    return this.moneyAccountService.blockMoneyAccountById(id);
  }
}
