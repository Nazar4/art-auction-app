import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { UserRepository } from './user.repository';
import { AuthModule } from 'src/auth/auth.module';
import { RoleModule } from 'src/role/role.module';
import { UserDoesNotExistConstraint } from './decorators/validation/user-does-not-exist.constraint';
import { MoneyAccountModule } from 'src/money-account/money-account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    RoleModule,
    MoneyAccountModule
  ],
  controllers: [UserController],
  providers: [UserDoesNotExistConstraint, UserService, UserRepository],
  exports: [UserRepository, UserService]
})
export class UserModule {}
