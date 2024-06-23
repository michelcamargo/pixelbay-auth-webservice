import { BaseEntity, DeepPartial } from 'typeorm';
import { SetMetadata } from '@nestjs/common';

export function Permissions(tableName: string, ...permissions: string[]) {
  return function (target: any) {
    SetMetadata('permissions', permissions)(target);
    target.permissions = {
      read: `read.${tableName}`,
      list: `list.${tableName}`,
      create: `create.${tableName}`,
      update: `update.${tableName}`,
      delete: `delete.${tableName}`,
      ...permissions.reduce((acc, permission) => {
        acc[permission] = `${permission}.${tableName}`;
        return acc;
      }, {}),
    };
  };
}

export abstract class PbEntity extends BaseEntity {
  static permissions: {
    read: string;
    list: string;
    create: string;
    update: string;
    delete: string;
    [key: string]: string; // Permissões custom
  };

  static getTableName(): string {
    throw new Error('getTableName() deve ser implementado pelas subclasses');
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
