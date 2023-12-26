import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from '../entities/manufacturer.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Role, SortType } from 'src/shared/type-utils/global.types';
import { UserService } from 'src/user/services/user.service';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { Constants } from 'src/shared/type-utils/global.constants';

export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private readonly manufacturerRepository: Repository<Manufacturer>,
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  private getManufacturerBaseQuery(): SelectQueryBuilder<Manufacturer> {
    return this.manufacturerRepository.createQueryBuilder('man');
  }

  public async createManufacturer(
    createUserDto: CreateUserDto,
  ): Promise<string> {
    const newUser = await this.userService.createUser(
      createUserDto,
      Constants.MANUFACTURER_ROLE as Role,
    );
    const manufacturer = new Manufacturer({ user: newUser });
    await this.manufacturerRepository.save(manufacturer);
    return this.authService.getTokenForUser(newUser);
  }

  public async getManufacturerById(id: number): Promise<Manufacturer> {
    return await this.getManufacturerBaseQuery()
      .where('man.id = :id', { id })
      .getOneOrFail();
  }

  public async getManufacturersSortedByAverageRating(
    sortType: SortType = 'DESC',
  ): Promise<Manufacturer[]> {
    return await this.getManufacturerBaseQuery()
      .orderBy('man.average_rating', sortType)
      .getMany();
  }

  public async getManufacturerByUserId(id: number): Promise<Manufacturer> {
    return await this.getManufacturerBaseQuery()
      .leftJoinAndSelect('man.user', 'user')
      .where('man.user_id = :id', { id })
      .getOneOrFail();
  }
}
