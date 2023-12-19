import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
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
import { ParsePositiveIntPipe } from 'src/shared/pipes/parse-positive-int.pipe';
import { EntityNotFoundError } from 'typeorm';
import { Constants } from 'src/shared/type-utils/global.constants';

@Controller('requests')
export class RequestController {
  private readonly logger = new Logger(RequestController.name);

  constructor(private readonly requestService: RequestService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  public async getRequestById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Request> {
    try {
      return await this.requestService.getRequestById(id, user);
    } catch (error) {
      this.logger.warn(`/requests/${id} GET, Message: ${error.message}`);
      throw new NotFoundException();
    }
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  public async createRequest(
    @Body()
    createRequestDTO: CreateRequestDTO,
    @CurrentUser() user: User,
  ): Promise<Request> {
    try {
      return await this.requestService.createRequest(user, createRequestDTO);
    } catch (error) {
      this.logger.warn(`/requests POST, Message: ${error.message}`);
      throw new BadRequestException(error.message);
    }
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  @HttpCode(202)
  public async updateRequest(
    @Param('id', ParseIntPipe)
    id: number,
    @Query('sum', ParsePositiveIntPipe)
    sum: number,
    @CurrentUser()
    user: User,
  ): Promise<void> {
    try {
      return await this.requestService.updateRequest(id, sum, user);
    } catch (error) {
      this.logger.log(`/requests/${id} PATCH, Message: ${error.message}`);
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  public async removeRequest(
    @Param('id', ParseIntPipe)
    id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    try {
      await this.requestService.removeRequest(user, id);
    } catch (error) {
      this.logger.warn(`/requests/${id} DELETE, Message: ${error.message}`);
      throw error;
    }
  }
}
