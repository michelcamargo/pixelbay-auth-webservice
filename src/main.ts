import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import swaggerHelper from './common/helpers/swagger.helper';
import helmet from 'helmet';
// import * as fs from 'node:fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('cert/pg-pb.key'),
  //   cert: fs.readFileSync('cert/pg-pb.crt'),
  // };
  // const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  //   httpsOptions,
  // });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig = app.get(ConfigService);
  const runtimeUrl = appConfig.get<number>('APP_URL');
  const runtimePort = appConfig.get<number>('PORT');
  const appName = appConfig.get<string>('APP_NAME');

  if (!runtimeUrl || !runtimePort) throw Error('Sem variáveis de ambiente');

  swaggerHelper.generateAppDocument(app);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  await app.listen(runtimePort);
  console.log(`${appName} @ ${runtimeUrl}`);
}
bootstrap();
