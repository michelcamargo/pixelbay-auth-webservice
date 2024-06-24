import { BaseEntity, DeepPartial } from 'typeorm';
import { SetMetadata } from '@nestjs/common';

export function EntityPermissions(tableName: string, ...permissions: string[]) {
  return function (entity: any) {
    SetMetadata('permissions', permissions)(entity);
    entity.permissions = {
      find: `find.${tableName}`,
      find_self: `find_self.${tableName}`,
      list: `list.${tableName}`,
      create: `create.${tableName}`,
      update: `update.${tableName}`,
      update_self: `update_self.${tableName}`,
      delete: `delete.${tableName}`,
      delete_self: `delete_self.${tableName}`,
      ...permissions.reduce((acc, permission) => {
        acc[permission] = `${permission}.${tableName}`;
        return acc;
      }, {}),
    };

    entity.getPermissionsForTable = async function (
      tableName: string,
    ): Promise<string[]> {
      const entity = await this.findOne({ reference: tableName });
      if (entity) {
        return entity.permissions;
      }
      return [];
    };
  };
}

export abstract class PbEntity extends BaseEntity {
  static permissions: {
    find: string;
    find_self: string;
    list: string;
    create: string;
    update: string;
    update_self: string;
    delete: string;
    delete_self: string;
    [key: string]: string; // custom
  };

  /**
   * Retorna o nome da tabela relacionada, deve ser sobreescrito em entidade
   */
  protected getTableName(): string {
    throw new Error('getTableName() deve ser implementado pelas subclasses');
  }

  /**
   * Retorna campos escondidos da tabela, devem ser sobreescrito em entidade
   * @protected
   */
  protected getHiddenFields(): (keyof this)[] {
    return [];
  }

  toJSON(): Record<string, any> {
    const hiddenFields = this.getHiddenFields();
    const entity = { ...this };

    hiddenFields.forEach((field) => {
      delete entity[field];
    });

    return entity;
  }

  static pick<T extends BaseEntity | PbEntity>(
    entity: T,
    fields: (keyof T)[],
  ): T {
    return fields.reduce((obj, field) => {
      if (entity[field] !== undefined) {
        obj[field] = entity[field];
      }
      return obj;
    }, {} as Partial<T>) as DeepPartial<T> as T;
  }
}
