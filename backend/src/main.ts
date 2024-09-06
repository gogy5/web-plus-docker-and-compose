import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    const logger = new Logger(req.method);
    logger.log(`Incoming Request: ${req.method} ${req.originalUrl}`);

    res.on('finish', () => {
      logger.log(`Response Status: ${res.statusCode}`);
    });

    next();
  });

  app.enableCors();
  // app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
