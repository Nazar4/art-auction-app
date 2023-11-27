import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { User } from 'src/user/entities/user.entity';
import { CreateRequestDTO } from '../dtos/create-request.dto';
import { RequestService } from '../services/request.service';
import { Request } from '../entities/request.entity';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('user')
  public async createRequest(
    @Body()
    createRequestDTO: CreateRequestDTO,
    @CurrentUser() user: User,
  ): Promise<Request> {
    try {
      return await this.requestService.createRequest(user, createRequestDTO);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
