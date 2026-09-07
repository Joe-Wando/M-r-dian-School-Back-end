import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

/**
 * Valide qu'une valeur est un objet plat dont toutes les valeurs sont des
 * chaînes non vides (ex : { "L1": "texte", "L2": "texte" }).
 */
export function IsStringRecord(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'isStringRecord',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            return false;
          }
          return Object.values(value as Record<string, unknown>).every(
            (v) => typeof v === 'string' && v.trim().length > 0,
          );
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} doit être un objet { clé: texte } (valeurs non vides).`;
        },
      },
    });
  };
}
