import { InjectRepository } from '@nestjs/typeorm';
import { Review } from '../entities/review.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateReviewDTO } from '../dtos/create-review.dto';
import { ManufacturerService } from 'src/manufacturer/services/manufacturer.service';
import { User } from 'src/user/entities/user.entity';

export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly manfuacturerService: ManufacturerService,
  ) {}

  private getReviewBaseQuery(): SelectQueryBuilder<Review> {
    return this.reviewRepository.createQueryBuilder('r');
  }

  public async getReviewById(id: number): Promise<Review | undefined> {
    return await this.reviewRepository.findOneBy({ id });
  }

  public async createReview(
    createReviewDTO: CreateReviewDTO,
    creator: User,
  ): Promise<Review> {
    const manufacturer = await this.manfuacturerService.getManufacturerById(
      createReviewDTO.manufacturerId,
    );
    //need to first check that user can make a review
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
