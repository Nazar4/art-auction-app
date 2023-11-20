import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Manufacturer } from './entities/manufacturer.entity';
import { ManufacturerService } from './services/manufacturer.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { ManufacturerController } from './controllers/manufacturer.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Manufacturer]), UserModule, AuthModule],
  providers: [ManufacturerService],
  controllers: [ManufacturerController],
  exports: [ManufacturerService],
})
export class ManufacturerModule {}
