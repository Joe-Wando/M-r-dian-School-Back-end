import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

/**
 * Filtre d'exception global : format de réponse d'erreur homogène,
 * traduction des erreurs Prisma connues, et aucune fuite de stack trace
 * en production.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  constructor(private readonly isProd: boolean) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Erreur interne du serveur';
    let details: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (typeof body === 'object' && body !== null) {
        const b = body as Record<string, unknown>;
        message = (b.message as string | string[]) ?? exception.message;
        details = b.details ?? b.errors;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      ({ status, message } = mapPrismaError(exception));
    } else if (exception instanceof Prisma.PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Requête base de données invalide.';
    }

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
      if (this.isProd) {
        message = 'Erreur interne du serveur';
        details = undefined;
      }
    }

    response.status(status).json({
      error: {
        statusCode: status,
        message,
        ...(details ? { details } : {}),
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

function mapPrismaError(exception: Prisma.PrismaClientKnownRequestError): {
  status: number;
  message: string;
} {
  switch (exception.code) {
    case 'P2002':
      return {
        status: HttpStatus.CONFLICT,
        message: "Cette ressource existe déjà (contrainte d'unicité).",
      };
    case 'P2025':
      return { status: HttpStatus.NOT_FOUND, message: 'Ressource introuvable.' };
    case 'P2003':
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Référence invalide vers une ressource liée.',
      };
    default:
      return { status: HttpStatus.BAD_REQUEST, message: 'Requête base de données invalide.' };
  }
}
