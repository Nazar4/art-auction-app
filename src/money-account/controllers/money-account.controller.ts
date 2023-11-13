import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { MoneyAccountService } from '../services/money-account.service';
import { MoneyAccount } from '../entities/money-account.entity';

@Controller('money-accounts')
export class MoneyAccountController {
  private readonly logger = new Logger(MoneyAccountController.name);

  constructor(private readonly moneyAccountService: MoneyAccountService) {}

  @Get(':id')
  // @UsePipes(new ValidationPipe({transform: true}))
  // @UseInterceptors(ClassSerializerInterceptor)
  public async getMoneyAccountById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MoneyAccount | undefined> {
    return await this.moneyAccountService.getMoneyAccountById(id);
  }

  @Get()
  // @UsePipes(new ValidationPipe({transform: true}))
  // @UseInterceptors(ClassSerializerInterceptor)
  public async getMoneyAccountByName(
    @Query('name') name: string,
  ): Promise<MoneyAccount | undefined> {
    return await this.moneyAccountService.getMoneyAccountByName(name);
  }

  @Patch(':id')
  public async updateMoneyAccountName(
    @Param('id', ParseIntPipe) id,
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

  @Patch(':id')
  public async blockMoneyAccount(@Param('id', ParseIntPipe) id): Promise<void> {
    try {
      await this.moneyAccountService.blockMoneyAccountById(id);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
