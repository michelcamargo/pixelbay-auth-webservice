import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEntity } from './entities/client.entity';
import { RoleEntity } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEntity, RoleEntity])],
})
export class ClientsModule {}
