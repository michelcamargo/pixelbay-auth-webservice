import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { CustomersService } from '../customers/customers.service';
import { CustomerEntity } from '../customers/entities/customer.entity';
import { RoleEntity } from '../roles/entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CustomerEntity, RoleEntity])],
  controllers: [UsersController],
  providers: [UsersService, AuthService, JwtService, CustomersService],
  exports: [UsersService],
})
export class UsersModule {}
