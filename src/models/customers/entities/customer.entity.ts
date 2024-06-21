import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { AddressEntity } from '../../addresses/entities/address.entity';
import { PbEntity } from '../../../common/entities/base.entity';

@Entity({ name: 'pb_customers' })
export class CustomerEntity extends PbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  address_id: number;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 255, nullable: true })
  fullname: string;

  @Column({ length: 127, nullable: true })
  firstname: string;

  @Column({ length: 127, nullable: true })
  lastname: string;

  @Column({ length: 31, nullable: true })
  phone: string;

  @Column({ length: 255, nullable: true })
  business_name: string;

  @Column({ length: 511, nullable: true })
  description: string;

  @Column({ length: 511, nullable: true })
  notes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToOne(() => AddressEntity)
  @JoinColumn({ name: 'address_id' })
  address: AddressEntity;
}
