import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PbEntity, Permissions } from '../../../common/entities/base.entity';

@Entity({ name: 'pb_roles' })
@Permissions('pb_roles')
export class RoleEntity extends PbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;

  @Column()
  role_name: string;

  @Column('text', { array: true })
  permissions: string[];

  static getTableName(): string {
    return this.name;
  }
}
