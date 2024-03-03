import fastifyHelmet from '@fastify/helmet';
import { swaggerConfig } from '@neox-api/config';
import { isProduction } from '@neox-api/shared/common';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger as PinoLogger, LoggerErrorInterceptor } from 'nestjs-pino';
import { AppModule } from './app';

declare const module: any;

async function bootstrap() {
  const globalPrefix = 'api';

  const stage = process.env.STAGE;
  const nodeEnv = process.env.NODE_ENV;
  new Logger('Stage').warn(stage.toUpperCase());

  // Checks if STAGE matches NODE_ENV
  if (stage !== nodeEnv) {
    throw new Error(
      `Configuration error: The value of STAGE (${stage}) does not match NODE_ENV (${nodeEnv}), check .env file.`,
    );
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.setGlobalPrefix(globalPrefix);
  app.useLogger(app.get(PinoLogger));
  app.enableCors();

  if (!isProduction()) {
    swaggerConfig(app, port, nodeEnv);
  }

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

  await app.listen(port, '0.0.0.0').then(() => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
      'NestApplication',
    );
  });

  // This is necessary to make the hot-reload work with Docker
  /*  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }*/
}

bootstrap();
