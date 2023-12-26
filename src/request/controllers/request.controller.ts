import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthGuardJwt } from 'src/auth/guards/auth-guard.jwt';
import { RolesGuard } from 'src/auth/guards/auth-guard.roles';
import { ParsePositiveIntPipe } from 'src/shared/pipes/parse-positive-int.pipe';
import { Constants } from 'src/shared/type-utils/global.constants';
import { User } from 'src/user/entities/user.entity';
import { EntityNotFoundError } from 'typeorm';
import { CreateRequestDTO } from '../dtos/create-request.dto';
import { Request } from '../entities/request.entity';
import { RequestService } from '../services/request.service';
import { EntityNotFoundExceptionFilter } from 'src/shared/exceptions/filters/entity-not-found-exception.filter';
import { IllegalExceptionFilter } from 'src/shared/exceptions/filters/custom-http-exception.filter';

@Controller('requests')
export class RequestController {
  private readonly logger = new Logger(RequestController.name);

  constructor(private readonly requestService: RequestService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  @UseFilters(EntityNotFoundExceptionFilter)
  public getRequestById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Request> {
    return this.requestService.getRequestById(id, user);
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  @UseFilters(IllegalExceptionFilter)
  public createRequest(
    @Body()
    createRequestDTO: CreateRequestDTO,
    @CurrentUser() user: User,
  ): Promise<Request> {
    return this.requestService.createRequest(user, createRequestDTO);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  @UseFilters(EntityNotFoundExceptionFilter, IllegalExceptionFilter)
  @HttpCode(HttpStatus.ACCEPTED)
  public updateRequest(
    @Param('id', ParseIntPipe)
    id: number,
    @Query('sum', ParsePositiveIntPipe)
    sum: number,
    @CurrentUser()
    user: User,
  ): Promise<void> {
    return this.requestService.updateRequest(id, sum, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuardJwt, RolesGuard)
  @Roles(Constants.USER_ROLE)
  @UseFilters(IllegalExceptionFilter)
  public async removeRequest(
    @Param('id', ParseIntPipe)
    id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.requestService.removeRequest(user, id);
  }
}
