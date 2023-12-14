import { DataSource, In } from 'typeorm';
import { MONEY_ACCOUNT_LIST, ROLE_LIST, USER_LIST } from '../seeds/seed.data';
import { Role } from 'src/role/entities/role.entity';
import { MoneyAccount } from 'src/money-account/entities/money-account.entity';
import { User } from 'src/user/entities/user.entity';
import { Constants } from 'src/shared/type-utils/global.constants';
import { AuthService } from '../../auth/services/auth.service';
import { RoleService } from '../../role/services/role.service';

export async function seedInitialDBData(
  dataSource: DataSource,
  authService: AuthService,
  roleService: RoleService,
): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  const moneyAccountRepository = dataSource.getRepository(MoneyAccount);
  const userRepository = dataSource.getRepository(User);

  try {
    const rolesList = ROLE_LIST;
    for (const role of rolesList) {
      let _role = roleRepository.create(role as unknown as Role);
      await roleRepository.save(_role);
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const moneyAccountsList = MONEY_ACCOUNT_LIST;
    for (const moneyAccount of moneyAccountsList) {
      let _moneyAccount = moneyAccountRepository.create(
        moneyAccount as unknown as MoneyAccount,
      );
      await moneyAccountRepository.save(_moneyAccount);
    }
  } catch (error) {
    console.error(error);
  }

  try {
    const usersList = USER_LIST;
    for (const user of usersList) {
      let _user = userRepository.create({
        ...(user as unknown as User),
        password: await authService.hashPassword(user.password),
        role: await roleService.getRoleByName(Constants.ADMIN_ROLE),
      });
      await userRepository.save(_user);
    }
  } catch (error) {
    console.error(error);
  }
}
