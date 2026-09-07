import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, MinLength, validateSync } from 'class-validator';

/**
 * Validation des variables d'environnement au démarrage.
 * L'application refuse de démarrer si une variable critique manque.
 */
enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(NodeEnvironment)
  NODE_ENV?: NodeEnvironment;

  @IsOptional()
  @IsInt()
  PORT?: number;

  @IsString()
  @MinLength(1)
  DATABASE_URL!: string;

  @IsOptional()
  @IsString()
  JWT_SECRET?: string;

  @IsOptional()
  @IsString()
  NABOOPAY_WEBHOOK_SECRET?: string;
}

export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(
      `Configuration d'environnement invalide :\n${errors
        .map((e) => `  - ${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`)
        .join('\n')}`,
    );
  }

  const isProd = validated.NODE_ENV === NodeEnvironment.Production;
  if (isProd) {
    const missing: string[] = [];
    if (!config.JWT_SECRET) missing.push('JWT_SECRET');
    if (!config.NABOOPAY_WEBHOOK_SECRET) missing.push('NABOOPAY_WEBHOOK_SECRET');
    if (missing.length > 0) {
      throw new Error(`Variables obligatoires en production manquantes : ${missing.join(', ')}`);
    }
  }

  return config;
}
