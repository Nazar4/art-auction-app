import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalPipes(new ValidationPipe());
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
