import {
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { IllegalStateException } from 'src/shared/exceptions/IllegalStateException';
import { User } from 'src/user/entities/user.entity';
import { MoneyAccount } from '../entities/money-account.entity';
import { MoneyAccountService } from '../services/money-account.service';

@Controller('money-accounts')
export class MoneyAccountController {
  private readonly logger = new Logger(MoneyAccountController.name);

  constructor(private readonly moneyAccountService: MoneyAccountService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('user', 'manufacturer')
  public async getMoneyAccountById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<MoneyAccount> {
    try {
      return await this.moneyAccountService.getMoneyAccountById(id, user);
    } catch (error) {
      this.logger.log(`/money-accounts/${id} GET, Message: ${error.message}`);
      if (error instanceof IllegalStateException) {
        throw new ForbiddenException();
      }
      throw new NotFoundException();
    }
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('user', 'manufacturer')
  public async getMoneyAccountByName(
    @Query('name') name: string,
    @CurrentUser() user: User,
  ): Promise<MoneyAccount> {
    try {
      return await this.moneyAccountService.getMoneyAccountByName(name, user);
    } catch (error) {
      this.logger.log(`/money-accounts GET, Message: ${error.message}`);
      if (error instanceof IllegalStateException) {
        throw new ForbiddenException();
      }
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('user', 'manufacturer')
  public async updateMoneyAccountName(
    @Param('id', ParseIntPipe) id: number,
    @Query('name') name: string,
    @CurrentUser() user: User,
  ): Promise<MoneyAccount> {
    try {
      return await this.moneyAccountService.updateMoneyAccountNameById(
        id,
        name,
        user,
      );
    } catch (error) {
      this.logger.log(`/money-accounts/${id} PATCH, Message: ${error.message}`);
      if (error instanceof IllegalStateException) {
        throw new ForbiddenException();
      }
      throw new NotFoundException();
    }
  }

  @Post(':id')
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('admin')
  public async blockMoneyAccount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      await this.moneyAccountService.blockMoneyAccountById(id);
    } catch (error) {
      this.logger.log(`/money-accounts/${id} POST, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }
}
