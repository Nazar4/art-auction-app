import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyAccount } from './entities/money-account.entity';
import { MoneyAccountController } from './controllers/money-account.controller';
import { MoneyAccountService } from './services/money-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([MoneyAccount])],
  providers: [MoneyAccountService],
  controllers: [MoneyAccountController],
  exports: [MoneyAccountService],
})
export class MoneyAccountModule {}
