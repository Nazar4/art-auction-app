import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoneyAccount } from '../entities/money-account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MoneyAccountService {
  private readonly logger = new Logger(MoneyAccountService.name);

  constructor(
    @InjectRepository(MoneyAccount)
    private readonly moneyAccountRepository: Repository<MoneyAccount>,
  ) {}

  public async getMoneyAccountById(
    id: number,
  ): Promise<MoneyAccount | undefined> {
    this.logger.debug(`getMoneyAccountById called with ${id}`);
    return await this.moneyAccountRepository.findOneBy({ id });
  }

  public async getMoneyAccountByName(
    name: string,
  ): Promise<MoneyAccount | undefined> {
    const moneyAccount = await this.moneyAccountRepository.findOneBy({ name });
    console.log(name);
    console.dir(moneyAccount);
    return moneyAccount;
  }

  public async blockMoneyAccountById(
    id: number,
  ): Promise<MoneyAccount | undefined> {
    const moneyAccount = await this.moneyAccountRepository.findOneByOrFail({
      id,
    });
    return await this.moneyAccountRepository.save({
      ...moneyAccount,
      blocked: true,
    });
  }

  public async updateMoneyAccountNameById(
    id: number,
    name: string,
  ): Promise<MoneyAccount | undefined> {
    const moneyAccount = await this.moneyAccountRepository.findOneByOrFail({
      id,
    });
    return await this.moneyAccountRepository.save({
      ...moneyAccount,
      name,
    });
  }
}
