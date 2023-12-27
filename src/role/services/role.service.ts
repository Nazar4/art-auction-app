import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';

export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>
  ) {}

  public async getRoleByName(name: string) {
    return await this.roleRepository.findOneByOrFail({ name });
  }

  public async getUserRole() {
    return await this.roleRepository.findOneByOrFail({ name: 'user' });
  }

  public async getManufacturerRole() {
    return await this.roleRepository.findOneByOrFail({ name: 'manufacturer' });
  }
}
