import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  PbEntity,
  EntityPermissions,
} from '../../../common/entities/base.entity';

@Entity({ name: 'pb_roles' })
@EntityPermissions('pb_roles')
export class RoleEntity extends PbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;

  @Column()
  role_name: string;

  @Column('text', { array: true })
  permissions: string[];

  @Column()
  reference: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  static getTableName(): string {
    return this.name;
  }
}
