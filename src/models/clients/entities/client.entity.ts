import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { PbEntity, Permissions } from '../../../common/entities/base.entity';

@Entity({ name: 'pb_clients' })
@Permissions('pb_clients')
export class ClientEntity extends PbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_name: string;

  @Column()
  label: string;

  @Column()
  description: string;

  @Column()
  created_by: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  static getTableName(): string {
    return this.name;
  }
}
