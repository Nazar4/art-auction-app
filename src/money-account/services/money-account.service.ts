import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoneyAccount } from '../entities/money-account.entity';
import { QueryRunner, Repository } from 'typeorm';
import { BalanceInUseGreaterThanBalanceException } from '../errors/balance-in-use-greater-than-balance.error';

@Injectable()
export class MoneyAccountService {
  private readonly logger = new Logger(MoneyAccountService.name);

  constructor(
    @InjectRepository(MoneyAccount)
    private readonly moneyAccountRepository: Repository<MoneyAccount>,
  ) {}

  public async createInitialMoneyAccount(name: string) {
    return await this.moneyAccountRepository.save(
      new MoneyAccount({
        balance: 0.0,
        balanceInUse: 0.0,
        name: this.generateUniqueName(name),
      }),
    );
  }

  public async encreaseBalanceInUse(
    moneyAccount: MoneyAccount,
    balanceInUse: number,
    queryRunner: QueryRunner,
  ): Promise<void> {
    moneyAccount.balanceInUse =
      Number(moneyAccount.balanceInUse) + Number(balanceInUse);
    if (moneyAccount.balanceInUse > moneyAccount.balance) {
      throw new BalanceInUseGreaterThanBalanceException(
        moneyAccount.balanceInUse,
        moneyAccount.balance,
      );
    }

    await queryRunner.manager.save(MoneyAccount, moneyAccount);
    // await this.moneyAccountRepository.save(moneyAccount);
  }

  public async decreaseBalanceInUse(
    moneyAccount: MoneyAccount,
    balanceInUse: number,
  ): Promise<void> {
    moneyAccount.balanceInUse -= balanceInUse;
    await this.moneyAccountRepository.save(moneyAccount);
  }

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

  private generateUniqueName(name: string): string {
    const currentTime = new Date().getTime();
    const randomDigits = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    const uniqueName = `${name}_${currentTime}_${randomDigits}`;

    return uniqueName;
  }
}
