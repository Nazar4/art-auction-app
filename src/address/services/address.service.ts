import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IllegalAccessException } from 'src/shared/exceptions/IllegalAccessException';
import { User } from 'src/user/entities/user.entity';
import {
  DeleteResult,
  EntityManager,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { CreateAddressDTO } from '../dtos/create-address.dto';
import { UpdateAddressDTO } from '../dtos/update-address.dto';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly entityManager: EntityManager,
  ) {}

  private getAddressBaseQuery(): SelectQueryBuilder<Address> {
    return this.addressRepository.createQueryBuilder('ad');
  }

  public async getAddressById(id: number): Promise<Address> {
    return await this.getAddressBaseQuery()
      .where('ad.id = :id', { id })
      .getOneOrFail();
  }

  public async createAddress(address: CreateAddressDTO): Promise<Address> {
    return await this.addressRepository.save(new Address({ ...address }));
  }

  public async updateAddress(
    inputAddress: UpdateAddressDTO,
    originalAddressId: number,
    user: User,
  ): Promise<Address> {
    const userWithAddress = await this.entityManager.findOne(User, {
      where: { id: user.id },
      relations: ['address'],
    });

    if (
      !userWithAddress ||
      !userWithAddress.address ||
      userWithAddress.address.id !== originalAddressId
    ) {
      throw new IllegalAccessException(
        `User: ${user.username} is not owner of the address: ${originalAddressId}`,
      );
    }

    return await this.addressRepository.save(
      new Address({
        ...userWithAddress.address,
        ...inputAddress,
      }),
    );
  }

  public async deleteAddress(id: number, user: User): Promise<DeleteResult> {
    const userWithAddress = await this.entityManager.findOne(User, {
      where: { id: user.id },
      relations: ['address'],
    });

    if (
      !userWithAddress ||
      !userWithAddress.address ||
      userWithAddress.address.id !== id
    ) {
      throw new IllegalAccessException(
        `User: ${user.username} is not owner of the address: ${id}`,
      );
    }

    return await this.addressRepository
      .createQueryBuilder('address')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
