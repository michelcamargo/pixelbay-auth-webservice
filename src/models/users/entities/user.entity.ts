import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { PbEntity } from '../../../common/entities/base.entity';

@Entity('pb_users')
export class UserEntity extends PbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true })
  alias?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  client_id: number;

  @Column({ default: false })
  is_removed: boolean;

  @Column({ default: false })
  is_block: boolean;

  @Column({ nullable: true })
  last_address: string;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
