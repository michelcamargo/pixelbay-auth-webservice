import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from '../../models/users/users.service';
import { RolesService } from '../../models/roles/roles.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
    private rolesService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    const permissionData = this.reflector.get<{
      table: string;
      actions: string[];
    }>('permissions', context.getHandler());

    // Se não há restrições, permite acesso
    if (!requiredRoles && !permissionData) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new ForbiddenException('Token de acesso não fornecido');
    }

    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      const user = await this.usersService.findById(userId, {
        relations: ['profile', 'profile.role'],
      });

      if (!user) {
        throw new ForbiddenException('Usuário não encontrado');
      }

      // Verificação de roles (se necessário)
      if (requiredRoles && requiredRoles.length > 0) {
        this.validateProfile(user.profile.name, requiredRoles);
      }

      // Verificação de permissões (se necessário)
      if (permissionData) {
        await this.validatePermissions(
          user.profile.role.id,
          permissionData.table,
          permissionData.actions,
          request,
          userId,
        );
      }

      return true;
    } catch (error) {
      this.logger.error(`Falha na autorização: ${error.message}`);
      throw new ForbiddenException(error.message || 'Acesso negado');
    }
  }

  private extractToken(request: Request): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader) return null;

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }

  private validateProfile(
    userProfileName: string,
    requiredRoles: string[],
  ): void {
    if (!userProfileName) {
      throw new ForbiddenException('Perfil do usuário não configurado');
    }

    const [clientName, roleName] = userProfileName.split(':');

    if (!clientName || !roleName) {
      throw new ForbiddenException('Formato de perfil inválido');
    }

    const hasRole = requiredRoles.some((requiredRole) => {
      return userProfileName === requiredRole || roleName === requiredRole;
    });

    if (!hasRole) {
      throw new ForbiddenException(
        `Acesso negado. Perfil requerido: ${requiredRoles.join(', ')}. Seu perfil: ${userProfileName}`,
      );
    }
  }

  private async validatePermissions(
    roleId: number,
    tableName: string,
    requiredActions: string[],
    request: Request,
    userId: string,
  ): Promise<void> {
    const permissions = await this.rolesService.getPermissionsForRoleAndTable(
      roleId,
      tableName,
    );

    if (!permissions || permissions.length === 0) {
      throw new ForbiddenException(
        `Nenhuma permissão configurada para ${tableName}`,
      );
    }

    // Verifica cada ação requerida
    for (const action of requiredActions) {
      const hasPermission = this.checkActionPermission(
        action,
        permissions,
        request,
        userId,
      );

      if (!hasPermission) {
        throw new ForbiddenException(
          `Permissão negada para ${action} em ${tableName}`,
        );
      }
    }
  }

  private checkActionPermission(
    action: string,
    userPermissions: string[],
    request: Request,
    userId: string,
  ): boolean {
    const isSelfAction = action.endsWith('_self');
    const baseAction = isSelfAction ? action.replace('_self', '') : action;

    // Verifica permissão geral
    if (userPermissions.includes(baseAction)) {
      return true;
    }

    // Verifica permissão para recurso próprio
    if (isSelfAction && userPermissions.includes(`${baseAction}_self`)) {
      return this.isResourceOwner(request, userId);
    }

    return false;
  }

  private isResourceOwner(request: Request, userId: string): boolean {
    // Verifica no corpo da requisição
    if (request.body?.userId && request.body.userId === userId) {
      return true;
    }

    // Verifica nos parâmetros da rota
    if (request.params?.userId && request.params.userId === userId) {
      return true;
    }

    // Verifica no query string
    if (request.query?.userId && request.query.userId === userId) {
      return true;
    }

    // Implementação específica para cada entidade pode ser adicionada aqui
    return false;
  }
}
