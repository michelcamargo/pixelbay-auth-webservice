import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

function generateAppDocument(app) {
  let swaggerOptions: Omit<OpenAPIObject, 'paths'>;

  // eslint-disable-next-line prefer-const
  swaggerOptions = new DocumentBuilder()
    .setTitle('Serviço de autenticação - PixelBay')
    .setDescription('Documentação da interface de ponto de acesso.')
    .setVersion('0.1')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);
}

export default {
  generateAppDocument,
};
