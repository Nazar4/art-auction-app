import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { AuthService } from 'src/auth/services/auth.service';
import { Constants } from 'src/shared/type-utils/global.constants';
import { Role } from 'src/shared/type-utils/global.types';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { IllegalExceptionFilter } from 'src/shared/exceptions/filters/custom-http-exception.filter';
import { EntityNotFoundExceptionFilter } from 'src/shared/exceptions/filters/entity-not-found-exception.filter';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  // @Get()
  // @UseGuards(AuthGuardJwt)
  // @UseInterceptors(ClassSerializerInterceptor)
  // public async getAll(@CurrentUser() user: User): Promise<User[]> {
  //   return await this.userService.getAll();
  // }

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseFilters(EntityNotFoundExceptionFilter)
  @UseInterceptors(ClassSerializerInterceptor)
  public getCurrentUser(@CurrentUser() user: User): Promise<User> {
    // try {
    return this.userService.getUserWithRelations(user);
    // } catch (error) {
    //   this.logger.warn(`/users/${id} GET, Message: ${error.message}`);
    //   throw new NotFoundException();
    // }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  public async registerUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<any> {
    const user = await this.userService.createUser(
      createUserDto,
      Constants.USER_ROLE as Role
    );

    return {
      token: this.authService.getTokenForUser(user)
    };
  }

  //patch to update user info
}
