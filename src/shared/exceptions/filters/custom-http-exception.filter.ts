import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IllegalAccessException } from '../IllegalAccessException';
import { IllegalArgumentException } from '../IllegalArgumentException';
import { IllegalStateException } from '../IllegalStateException';

@Catch(IllegalStateException, IllegalArgumentException, IllegalAccessException) //can put multiple exceptions here
export class IllegalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(IllegalExceptionFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(
      `${request.url} ${request.method}, Message: ${exception.message}`
    );

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      path: request.url,
      message: exception.message
    });
  }
}
