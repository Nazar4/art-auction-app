import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { IllegalStateException } from '../IllegalStateException';
import { IllegalArgumentException } from '../IllegalArgumentException';

@Catch(IllegalStateException, IllegalArgumentException) //can put multiple exceptions here
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = HttpStatus.BAD_REQUEST;
    const message = exception.message || 'Invalid request';

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
