import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import LoggingInterceptor from './common/interceptors/logging.interceptor';
import swaggerHelper from './common/helpers/swagger.helper';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig = app.get(ConfigService);
  const runtimeUrl = appConfig.get<number>('APP_URL');
  const runtimePort = appConfig.get<number>('PORT');

  if (!runtimeUrl || !runtimePort) throw Error('Sem variáveis de ambiente');

  swaggerHelper.generateAppDocument(app);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(runtimePort);
  console.warn(`PIXELBAY AUTH AT: ${runtimeUrl}`);
}
bootstrap();
