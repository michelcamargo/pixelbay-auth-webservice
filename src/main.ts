import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appConfig = app.get(ConfigService);
  const port = appConfig.get<number>('APP_PORT') || 7171;

  let swaggerOptions: Omit<OpenAPIObject, 'paths'>;

  // eslint-disable-next-line prefer-const
  swaggerOptions = new DocumentBuilder()
    .setTitle('Serviço de autenticação - PixelBay')
    .setDescription('Documentação da interface de ponto de acesso.')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  console.log('APP CONFIG', appConfig);

  await app.listen(port);
}
bootstrap();
