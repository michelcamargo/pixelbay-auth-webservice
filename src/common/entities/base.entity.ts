import { DeepPartial, BaseEntity } from 'typeorm';

export abstract class PbEntity extends BaseEntity {
  static pick<T extends BaseEntity>(
    entity: T,
    fields: (keyof T)[],
  ): DeepPartial<T> {
    return fields.reduce((obj, field) => {
      if (entity[field] !== undefined) {
        obj[field] = entity[field];
      }
      return obj;
    }, {} as Partial<T>) as DeepPartial<T>;
  }
}