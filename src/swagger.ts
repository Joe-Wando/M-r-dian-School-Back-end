import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Documentation OpenAPI interactive.
 *  - UI Swagger : GET /docs
 *  - Spec JSON  : GET /docs-json
 *
 * Le schéma est généré à partir des DTOs `class-validator` grâce au plugin CLI
 * `@nestjs/swagger` (voir nest-cli.json). Le bouton « Authorize » attend le JWT
 * renvoyé par POST /api/auth/login.
 */
export function setupSwagger(app: INestApplication, apiPrefix: string): void {
  const config = new DocumentBuilder()
    .setTitle('Meredian API')
    .setDescription(
      'API REST de la plateforme Meredian — catalogue de cours, filières, ' +
        'progression, paiements (Naboopay, stub), accompagnement, vitrine, admin. ' +
        'Toutes les routes sont préfixées par `/' +
        apiPrefix +
        '`.',
    )
    .setVersion('0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'jwt',
    )
    .addTag('Auth', 'Inscription, connexion, session')
    .addTag('Catalogue', 'Cours et filières — accès public')
    .addTag('Cours (admin)', 'Gestion des cours, modules et sections')
    .addTag('Filières (admin)', 'Édition du contenu éditorial des bandeaux')
    .addTag('Progression', 'Inscription aux cours, complétion des sections')
    .addTag('Paiements', 'Checkout Naboopay et webhook signé')
    .addTag('Accompagnement', 'Mentorat, sessions Q&R, correction de travaux')
    .addTag('Vitrine & contact', 'Profil public et formulaire de contact')
    .addTag('Admin', 'Statistiques et messages de contact')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs-json',
    swaggerOptions: { persistAuthorization: true },
  });
}
