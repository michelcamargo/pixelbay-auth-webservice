import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '@michelcamargo/website-shared';
import { RolesService } from './roles.service';
import { RolePermissionEntity } from '@michelcamargo/website-shared';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RolePermissionEntity])],
  controllers: [],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
