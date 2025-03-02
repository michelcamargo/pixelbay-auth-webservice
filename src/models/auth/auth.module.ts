import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConfig } from '../../config/auth/jwt.config';
import { CustomerEntity } from '../customers/entities/customer.entity';
import { UsersService } from '../users/users.service';
import { RoleEntity } from '../roles/entities/role.entity';
import { CustomersService } from '../customers/customers.service';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, CustomerEntity, RoleEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService, CustomersService],
  exports: [AuthService],
})
export class AuthModule {}
