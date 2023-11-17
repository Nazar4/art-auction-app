import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { UserRepository } from '../user.repository';
import { CreateUserDto } from '../dtos/create-user.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { RoleService } from 'src/role/services/role.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly userRepository: UserRepository,
  ) {}

  public async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User({
      ...createUserDto,
      password: await this.authService.hashPassword(createUserDto.password),
      role: await this.roleService.getUserRole(),
    });

    // await this.roleService.assignUserRole(user);
    // await this.moneyAccountService.createMoneyAccountForUser(user);

    return await this.userRepository.save(user);
  }
}
