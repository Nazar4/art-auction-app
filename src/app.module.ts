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
      autoLoadEntities: true /* any entity registered with
                              forFeature will be registered automatically*/,
      synchronize: true /*property will drop tables, need to remove it
                         after schemas creation*/,
    }),
    UserModule,
    AddressModule,
    RoleModule,
    ProductModule,
    ReviewModule,
    ManufacturerModule,
    RequestModule,
    AuctionLotModule,
    AuctionModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
