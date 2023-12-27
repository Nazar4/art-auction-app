import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoneyAccount } from '../entities/money-account.entity';
import { QueryRunner, Repository } from 'typeorm';
import { BalanceInUseGreaterThanBalanceException } from '../errors/balance-in-use-greater-than-balance.error';
import { User } from 'src/user/entities/user.entity';
import { IllegalStateException } from 'src/shared/exceptions/IllegalStateException';
import { IllegalAccessException } from 'src/shared/exceptions/IllegalAccessException';

@Injectable()
export class MoneyAccountService {
  private readonly logger = new Logger(MoneyAccountService.name);

  constructor(
    @InjectRepository(MoneyAccount)
    private readonly moneyAccountRepository: Repository<MoneyAccount>
  ) {}

  public async createInitialMoneyAccount(name: string) {
    return await this.moneyAccountRepository.save(
      new MoneyAccount({
        name: this.generateUniqueName(name)
      })
    );
  }

  public async encreaseBalanceInUse(
    moneyAccount: MoneyAccount,
    balanceInUse: number,
    queryRunner?: QueryRunner
  ): Promise<void> {
    moneyAccount.balanceInUse += balanceInUse;
    if (moneyAccount.balanceInUse > moneyAccount.balance) {
      throw new BalanceInUseGreaterThanBalanceException(
        moneyAccount.balanceInUse,
        moneyAccount.balance
      );
    }
    if (queryRunner) {
      await queryRunner.manager.save(MoneyAccount, moneyAccount);
    } else {
      await this.moneyAccountRepository.save(moneyAccount);
    }
  }

  public async decreaseBalanceInUse(
    moneyAccount: MoneyAccount,
    balanceInUse: number
  ): Promise<void> {
    moneyAccount.balanceInUse -= balanceInUse;
    await this.moneyAccountRepository.save(moneyAccount);
  }

  public async getMoneyAccountById(
    id: number,
    user: User
  ): Promise<MoneyAccount> {
    if (!this.isUserOwnerOfAnMoneyAccount(user, id)) {
      throw new IllegalAccessException(
        this.generateUserNotOwnerErrorMessage(user.username, id)
      );
    }
    return await this.moneyAccountRepository.findOneByOrFail({ id });
  }

  public async getMoneyAccountByName(
    name: string,
    user: User
  ): Promise<MoneyAccount> {
    if (!this.isUserOwnerOfAnMoneyAccount(user, undefined, name)) {
      throw new IllegalStateException(
        this.generateUserNotOwnerErrorMessage(user.username, name)
      );
    }
    return await this.moneyAccountRepository.findOneByOrFail({ name });
  }

  public async blockMoneyAccountById(id: number): Promise<MoneyAccount> {
    const moneyAccount = await this.moneyAccountRepository.findOneByOrFail({
      id
    });
    return await this.moneyAccountRepository.save({
      ...moneyAccount,
      blocked: true
    });
  }

  public async updateMoneyAccountNameById(
    id: number,
    name: string,
    user: User
  ): Promise<MoneyAccount> {
    if (!this.isUserOwnerOfAnMoneyAccount(user, id)) {
      throw new IllegalStateException(
        this.generateUserNotOwnerErrorMessage(user.username, id)
      );
    }
    const moneyAccount = await this.moneyAccountRepository.findOneByOrFail({
      id
    });
    return await this.moneyAccountRepository.save({
      ...moneyAccount,
      name
    });
  }

  private isUserOwnerOfAnMoneyAccount(
    user: User,
    id?: number,
    name: string = ''
  ): boolean {
    if (id) {
      return user.moneyAccount?.id === id;
    }
    return user.moneyAccount?.name === name;
  }

  private generateUniqueName(name: string): string {
    const currentTime = new Date().getTime();
    const randomDigits = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');

    const uniqueName = `${name}_${currentTime}_${randomDigits}`;

    return uniqueName;
  }

  private generateUserNotOwnerErrorMessage(
    username: string,
    identifier: number | string
  ): string {
    return `User: ${username} is not an owner of this money account: ${identifier}`;
  }
}
