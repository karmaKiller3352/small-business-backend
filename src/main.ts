import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe());
  app.use(morgan('tiny'));
  app.enableCors();
  app.setGlobalPrefix('api/v1')

  await app.listen(process.env.SERVER_PORT);
}
bootstrap();


