import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '../users/user.entity';
import { ROLES_KEY } from './roles.decorator';

/**
 * JwtAuthGuard — protects any route requiring authentication.
 * Extend with @Roles() decorator for role-based access.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

/**
 * OptionalJwtAuthGuard — extracts the authenticated user if Bearer token present,
 * but does not reject unauthenticated public requests.
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_err: any, user: any): TUser {
    return user || null;
  }
}

/**
 * RolesGuard — must be used together with JwtAuthGuard.
 * If no @Roles() metadata is set, allows any authenticated user.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No role restriction
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    const hasRole = requiredRoles.includes(user.role as UserRole);
    if (!hasRole) {
      throw new ForbiddenException(
        `Role '${user.role}' is not authorized. Required: ${requiredRoles.join(' or ')}`,
      );
    }
    return true;
  }
}
