import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { AuthService } from 'src/auth/services/auth.service';
import { Constants } from 'src/shared/type-utils/global.constants';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { Role } from 'src/shared/type-utils/global.types';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  public async getAll(@CurrentUser() user: User): Promise<User[]> {
    console.dir(user);
    return await this.userService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  public async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    const user = await this.userService.createUser(
      createUserDto,
      Constants.USER_ROLE as Role,
    );

    return {
      token: this.authService.getTokenForUser(user),
    };
  }

  //patch to update user info
}
