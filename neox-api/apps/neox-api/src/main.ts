/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import fastifyHelmet from '@fastify/helmet';
import {Logger, ValidationPipe} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.useGlobalPipes(new ValidationPipe());

  const port = 3000; // +configService.get('API_PORT')!;
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle(' example')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api ---')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token'
    )
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // this
    },
  });
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  app.enableCors();

  // const configService = app.get(EnvConfigService);

  await app.listen(port, '0.0.0.0').then(() => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
    );
  });
}

/*
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}
*/

bootstrap();
