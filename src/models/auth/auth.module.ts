import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import {
  RoleEntity,
  ProfileEntity,
  UserEntity,
  RolePermissionEntity,
  CustomerEntity,
} from '@michelcamargo/website-shared';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from '../../config/auth/jwt.config';
import { UsersService } from '../users/users.service';
import { CustomersService } from '../customers/customers.service';
import { RolesService } from '../roles/roles.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    PassportModule,
    RolesModule,
    TypeOrmModule.forFeature([
      UserEntity,
      CustomerEntity,
      RoleEntity,
      RolePermissionEntity,
      ProfileEntity,
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    UsersService,
    CustomersService,
    RolesService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
