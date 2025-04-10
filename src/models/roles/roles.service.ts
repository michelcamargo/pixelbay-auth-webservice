import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  RolePermissionEntity,
  RoleEntity,
} from '@michelcamargo/website-shared';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @InjectRepository(RolePermissionEntity)
    private rolePermissionRepo: Repository<RolePermissionEntity>,
  ) {}

  async getPermissionsForRoleAndTable(
    roleId: number,
    tableName: string,
  ): Promise<string[]> {
    const permission = await this.rolePermissionRepo
      .createQueryBuilder('rp')
      .innerJoin('rp.role', 'role')
      .where('role.id = :roleId', { roleId })
      .andWhere('rp.tableName = :tableName', { tableName })
      .getOne();

    return permission?.permissions || [];
  }

  async getRolePermissions(roleId: number): Promise<RolePermissionEntity[]> {
    return this.rolePermissionRepo
      .createQueryBuilder('rp')
      .innerJoin('rp.role', 'role')
      .where('role.id = :roleId', { roleId })
      .getMany();
  }

  // async getProfileName(roleId: number): Promise<string | null> {
  //   const result = await this.rolePermissionRepo
  //     .createQueryBuilder('rp')
  //     .innerJoin('rp.role', 'role')
  //     .where('role.id = :roleId', { roleId })
  //     .select(['rp.name'])
  //     .getOne();
  //
  //   return result?.name || null;
  // }

  async getProfileName(roleId: number): Promise<string | null> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      select: ['roleName'],
    });

    return role?.roleName || null;
  }
}
