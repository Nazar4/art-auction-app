import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { NestFactory } from '@nestjs/core';
import { seedInitialDBData } from './seeder';
import { AuthService } from 'src/auth/services/auth.service';
import { RoleService } from 'src/role/services/role.service';

(async () => {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get(DataSource);
  const authService = app.get(AuthService);
  const roleService = app.get(RoleService);
  await seedInitialDBData(dataSource, authService, roleService);
  await app.close();
})();
