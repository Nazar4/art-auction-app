import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressModule } from './address/address.module';
import { AuctionLotModule } from './auction-lot/auction-lot.module';
import { AuctionModule } from './auction/auction.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { ProductModule } from './product/product.module';
import { RequestModule } from './request/request.module';
import { ReviewModule } from './review/review.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MoneyAccountModule } from './money-account/money-account.module';
import { SharedModule } from './shared/shared.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
      isGlobal: true, //need to use it in each module
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      supportBigNumbers: false, //to make sure numbers are loaded as numbers not as strings
      autoLoadEntities: true /* any entity registered with
                              forFeature will be registered automatically*/,
      synchronize: true /*property will drop tables, need to remove it
                         after schemas creation*/,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot({
      // set this to `true` to use wildcards
      wildcard: false,
      // delimiter: '.', delimiter used to segment namespaces
      newListener: false,
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 5,
      verboseMemoryLeak: true,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),

    UserModule,
    AddressModule,
    RoleModule,
    ProductModule,
    ReviewModule,
    ManufacturerModule,
    MoneyAccountModule,
    RequestModule,
    AuctionLotModule,
    AuctionModule,
    AuthModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
