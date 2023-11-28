import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
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
import { Request } from '../entities/request.entity';
import { RequestService } from '../services/request.service';

@Controller('requests')
export class RequestController {
  private readonly logger = new Logger(RequestController.name);

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

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles('user')
  public async removeRequest(
    @Param('id', ParseIntPipe)
    id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    try {
      await this.requestService.removeRequest(user, id);
    } catch (error) {
      this.logger.warn(`/requests/${id} delete, Message: ${error.message}`);
      throw error;
    }
  }
}
