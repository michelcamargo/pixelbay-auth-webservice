import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { CustomerEntity } from '../../customers/entities/customer.entity';
import { PbEntity } from '../../../common/entities/base.entity';

@Entity({ name: 'pb_addresses' })
export class AddressEntity extends PbEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 127 })
  label: string;

  @Column({ length: 255 })
  street: string;

  @Column({ length: 127 })
  city: string;

  @Column({ length: 127 })
  state: string;

  @Column({ length: 20 })
  zip_code: string;

  @Column({ length: 127 })
  country: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  notes: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;
}
