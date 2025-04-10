import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionEntity } from '@michelcamargo/website-shared';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermissionEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class RolePermissionsModule {}
