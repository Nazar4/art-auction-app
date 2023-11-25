import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/services/auth.service';
import { RoleService } from 'src/role/services/role.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';
import { Role } from 'src/shared/type-utils/global.types';
import { MoneyAccountService } from 'src/money-account/services/money-account.service';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly moneyAccountService: MoneyAccountService,
    private readonly userRepository: UserRepository,
  ) {}

  public async getAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  public async createUser(
    createUserDto: CreateUserDto,
    role: Role,
  ): Promise<User> {
    const user = new User({
      ...createUserDto,
      password: await this.authService.hashPassword(createUserDto.password),
      role: await this.roleService.getRoleByName(role),
    });

    // await this.roleService.assignUserRole(user);
    const moneyAccount =
      await this.moneyAccountService.createInitialMoneyAccount(user.username);
    user.moneyAccount = moneyAccount;

    return await this.userRepository.save(user);
  }
}
