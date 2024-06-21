import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ClientEntity } from '../../clients/entities/client.entity';
import { PbEntity } from '../../../common/entities/base.entity'; // Assumindo que você tem uma entidade Client

@Entity({ name: 'pb_roles' })
export class RoleEntity extends PbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  client_id: number;

  @Column()
  role_name: string;

  @Column('text', { array: true })
  permissions: string[];

  @ManyToOne(() => ClientEntity, (client) => client.roles)
  client: ClientEntity;
}
