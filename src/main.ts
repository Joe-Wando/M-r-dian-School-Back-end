import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Le corps brut est nécessaire pour vérifier la signature du webhook Naboopay.
    rawBody: true,
  });

  const config = app.get(ConfigService);
  const isProd = config.get<string>('nodeEnv') === 'production';

  app.use(helmet());
  // HTTPS est géré par le reverse proxy / hébergeur (Railway, Render), pas ici.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  const corsOrigin = config.get<string[]>('corsOrigin') ?? ['*'];
  app.enableCors({
    origin: corsOrigin.includes('*') ? true : corsOrigin,
    credentials: true,
  });

  app.setGlobalPrefix(config.get<string>('apiPrefix') ?? 'api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // retire les champs non déclarés dans le DTO
      forbidNonWhitelisted: true, // 400 si champ inconnu
      transform: true, // instancie les DTO + coerce les types
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Gestion d'erreurs centralisée : pas de fuite de stack trace en production.
  app.useGlobalFilters(new AllExceptionsFilter(isProd));

  app.enableShutdownHooks();

  const port = config.get<number>('port') ?? 4000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`[meredian] API NestJS démarrée sur le port ${port}`);
}

void bootstrap();
