/**
 * Configuration centralisée, chargée par @nestjs/config.
 * Toutes les valeurs sensibles proviennent de variables d'environnement.
 */
export interface AppConfig {
  nodeEnv: string;
  port: number;
  apiPrefix: string;
  corsOrigin: string[];
  jwt: {
    secret: string;
    expiresIn: string;
  };
  payments: {
    mock: boolean;
    naboopayApiUrl: string;
    naboopayApiKey: string;
    webhookSecret: string;
    webhookSignatureHeader: string;
  };
  seed: {
    adminEmail: string;
    adminPassword: string;
    adminName: string;
  };
}

const toBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

export default (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const isProd = nodeEnv === 'production';

  return {
    nodeEnv,
    port: Number(process.env.PORT ?? 4000),
    apiPrefix: process.env.API_PREFIX ?? 'api',
    corsOrigin: (process.env.CORS_ORIGIN ?? '*')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean),
    jwt: {
      secret: process.env.JWT_SECRET ?? (isProd ? '' : 'dev-jwt-secret'),
      expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
    },
    payments: {
      mock: toBool(process.env.MOCK_PAYMENTS, !isProd),
      naboopayApiUrl: process.env.NABOOPAY_API_URL ?? 'https://api.naboopay.com',
      naboopayApiKey: process.env.NABOOPAY_API_KEY ?? '',
      webhookSecret:
        process.env.NABOOPAY_WEBHOOK_SECRET ?? (isProd ? '' : 'dev-webhook-secret'),
      webhookSignatureHeader: (
        process.env.NABOOPAY_WEBHOOK_SIGNATURE_HEADER ?? 'x-naboopay-signature'
      ).toLowerCase(),
    },
    seed: {
      adminEmail: process.env.ADMIN_EMAIL ?? 'admin@meredian.io',
      // Jamais de valeur par défaut : le seed exige un ADMIN_PASSWORD explicite.
      adminPassword: process.env.ADMIN_PASSWORD ?? '',
      adminName: process.env.ADMIN_NAME ?? 'Admin Meredian',
    },
  };
};
