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
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { AuthService } from 'src/auth/services/auth.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';

@Controller('/users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  public async getAll(): Promise<User[]> {
    return await this.userService.getAll();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  public async registerUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    const user = await this.userService.create(createUserDto);

    return {
      status: 'success',
      token: this.authService.getTokenForUser(user),
    };
  }
}
