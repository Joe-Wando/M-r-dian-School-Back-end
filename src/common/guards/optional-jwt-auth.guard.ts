import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Authentification JWT facultative : si un token valide est présent, `req.user`
 * est renseigné ; sinon la requête passe quand même (utilisateur anonyme).
 * Utile pour les routes publiques qui personnalisent leur réponse si connecté.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser | null {
    return user ?? null;
  }
}
