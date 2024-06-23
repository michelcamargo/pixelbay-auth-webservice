import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PbEntity, Permissions } from '../../../common/entities/base.entity';

@Entity({ name: 'pb_users' })
@Permissions('pb_users')
export class UserEntity extends PbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true, length: 63 })
  alias?: string;

  @Column({ unique: true, length: 127 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column()
  client_id: number;

  @Column()
  oauth_id: number;

  @Column({ default: false })
  is_removed: boolean;

  @Column({ default: false })
  is_block: boolean;

  @Column({ length: 63, nullable: true })
  last_address: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  static getTableName(): string {
    return this.name;
  }
}
