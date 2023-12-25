import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import * as express from 'express';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './shared/exceptions/filters/CustomExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomExceptionFilter()); //can be also put on top of controller's method

  await mkdir(process.env.FILE_UPLOAD_PATH, { recursive: true });

  app.use('/product-images', express.static(process.env.FILE_UPLOAD_PATH));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);

  process.on('disconnect', closeServer);
  process.on('SIGTERM', closeServer);
  process.on('SIGINT', closeServer);
  process.on('exit', closeServer);

  function closeServer() {
    app.close().catch(() => process.exit(1));
    // .finally(() => Sentry.close());
  }
}
bootstrap();
