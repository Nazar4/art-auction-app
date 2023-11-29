import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAddressDTO } from '../dtos/create-address.dto';
import { Address } from '../entities/address.entity';
import { UpdateAddressDTO } from '../dtos/update-address.dto';

@Injectable()
export class AddressService {
  private readonly logger = new Logger(AddressService.name);

  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  public async getAddressById(id: number): Promise<Address | undefined> {
    return await this.addressRepository.findOneBy({ id });
  }

  public async createAddress(address: CreateAddressDTO): Promise<Address> {
    return await this.addressRepository.save(new Address({ ...address }));
  }

  public async updateAddress(
    inputAddress: UpdateAddressDTO,
    originalAddress: Address,
  ): Promise<Address> {
    return await this.addressRepository.save(
      new Address({
        ...originalAddress,
        ...inputAddress,
      }),
    );
  }

  public async deleteAddress(id: number): Promise<DeleteResult> {
    await this.addressRepository.findOneByOrFail({ id });
    return await this.addressRepository
      .createQueryBuilder('address')
      .delete()
      .where('id = :id', { id })
      .execute();
  }
}
