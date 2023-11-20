import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewService } from './services/review.service';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';
import { ReviewController } from './controllers/review.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), ManufacturerModule],
  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
