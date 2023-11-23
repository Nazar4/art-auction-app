import {
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { MoneyAccount } from '../entities/money-account.entity';
import { MoneyAccountService } from '../services/money-account.service';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('money-accounts')
export class MoneyAccountController {
  private readonly logger = new Logger(MoneyAccountController.name);

  constructor(private readonly moneyAccountService: MoneyAccountService) {}

  @Get(':id')
  @UseGuards(AuthGuardJwt)
  // @UsePipes(new ValidationPipe({transform: true}))
  // @UseInterceptors(ClassSerializerInterceptor)
  public async getMoneyAccountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MoneyAccount | undefined> {
    return await this.moneyAccountService.getMoneyAccountById(id);
  }

  @Get()
  @UseGuards(AuthGuardJwt)
  // @UsePipes(new ValidationPipe({transform: true}))
  // @UseInterceptors(ClassSerializerInterceptor)
  public async getMoneyAccountByName(
    @Query('name') name: string,
  ): Promise<MoneyAccount | undefined> {
    return await this.moneyAccountService.getMoneyAccountByName(name);
  }

  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  public async updateMoneyAccountName(
    @Param('id', ParseIntPipe) id: number,
    @Query('name') name: string,
  ): Promise<MoneyAccount> {
    // if (address.organizerId !== user.id) {
    //     throw new ForbiddenException(`Not authorized to modify this event`);
    // }
    try {
      return await this.moneyAccountService.updateMoneyAccountNameById(
        id,
        name,
      );
    } catch (error) {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('admin')
  public async blockMoneyAccount(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      await this.moneyAccountService.blockMoneyAccountById(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
