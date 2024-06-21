import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PbEntity } from '../../../common/entities/base.entity';
import { RoleEntity } from "../../roles/entities/role.entity";

@Entity({ name: 'pb_clients' })
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

  @Column()
  created_at: string;

  @Column()
  updated_at: string;

  @OneToMany(() => RoleEntity, (role) => role.client)
  roles: RoleEntity[];
}
