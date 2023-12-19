import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import {
  DataSource,
  DeleteResult,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateReviewDTO } from '../dtos/create-review.dto';
import { ManufacturerService } from 'src/manufacturer/services/manufacturer.service';
import { User } from 'src/user/entities/user.entity';
import { AuctionLotView } from 'src/auction-lot/entities/auction-lot.view.entity';
import { IllegalStateException } from 'src/shared/exceptions/IllegalStateException';
import { IllegalArgumentException } from 'src/shared/exceptions/IllegalArgumentException';
import { NotFoundException } from '@nestjs/common';

export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly manfuacturerService: ManufacturerService,
    private readonly dataSource: DataSource,
  ) {}

  private getReviewBaseQuery(): SelectQueryBuilder<Review> {
    return this.reviewRepository.createQueryBuilder('r');
  }

  public async getReviewById(id: number): Promise<Review> {
    return await this.getReviewBaseQuery()
      .where('r.id = :id', { id })
      .leftJoinAndSelect('r.reviewer', 'reviewer')
      .getOneOrFail();
  }

  public async deleteReview(id: number, { id: userId }: User): Promise<void> {
    await this.getReviewBaseQuery()
      .where('id = :id', { id })
      .andWhere('user_id = :userId', { userId })
      .getOneOrFail();

    await this.getReviewBaseQuery()
      .delete() // does not work properly with aliases, need to make raw query
      .where('id = :id', { id })
      .andWhere('user_id = :userId', { userId })
      .execute();
  }

  public async createReview(
    createReviewDTO: CreateReviewDTO,
    creator: User,
  ): Promise<Review> {
    const manufacturer = await this.manfuacturerService.getManufacturerById(
      createReviewDTO.manufacturerId,
    );
    await this.dataSource.manager
      .findOneBy(AuctionLotView, {
        manufacturer: createReviewDTO.manufacturerId,
      })
      .then((entity: AuctionLotView) => {
        if (!entity) {
          throw new IllegalArgumentException(
            `Manufacturer with id: ${createReviewDTO.manufacturerId} did not create any products`,
          );
        }
        if (entity.winner !== creator.id) {
          throw new IllegalStateException(
            `User: ${creator.username} can not create review for this manufacturer`,
          );
        }
      })
      .catch((error) => {
        throw new IllegalStateException(error.message);
      });
    return await this.reviewRepository.save(
      new Review({ ...createReviewDTO, manufacturer, reviewer: creator }),
    );
  }

  public async getAllReviewsByManufacturerId(
    manufacturerId: number,
  ): Promise<Review[]> {
    return await this.getReviewBaseQuery()
      .where('r.manufacturer_id = :manufacturerId', { manufacturerId })
      .getMany();
  }
}
