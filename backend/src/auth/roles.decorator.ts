import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../users/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Usage: @Roles(UserRole.ADMIN, UserRole.FACULTY)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
