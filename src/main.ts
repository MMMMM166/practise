import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { corsOptions } from '@config/cors-options.config';
import { Logger, ValidationPipe } from '@nestjs/common';
import  cookieParser from 'cookie-parser';

const PORT = process.env.PORT ?? 3000;
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET не найден');
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(corsOptions);
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
  Logger.log(`Server started on port = ${PORT}`);
}
bootstrap();
