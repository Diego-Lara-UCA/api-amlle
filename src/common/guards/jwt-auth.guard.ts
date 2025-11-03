import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { log } from 'console';
import { IS_PUBLIC_KEY } from 'src/common/utils/decorators/public.decorator';
import { ROLES_KEY } from 'src/common/utils/decorators/roles.decorator';
import { Role } from 'src/models/user/enums/role.enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido o no proporcionado');
    }

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return user;
    }

    const hasRole = () => requiredRoles.some((role) => user.role === role);
    if (!hasRole()) {
      throw new ForbiddenException(
        'No tienes los permisos necesarios para acceder a este recurso.',
      );
    }
    
    return user;
  }
}