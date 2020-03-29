import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule)

  const options = new DocumentBuilder()
    .setTitle('covid19server')
    .setDescription('covid19server for covid19app.org')
    .setVersion('1.0')
    .addTag('covid19app')
    .build();
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  await app.listen(3001)
}
bootstrap()
