import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import ExceptionInterceptor from '../../common/interceptors/exception.interceptor';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { CustomersService } from '../customers/customers.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Permissions } from '../../common/decorators/permissions.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserEntity } from '@michelcamargo/website-shared';
import { CustomerEntity } from '@michelcamargo/website-shared';
import { Request } from 'express';

@Controller('users')
@UseInterceptors(ExceptionInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly customersService: CustomersService,
  ) {}

  @Post()
  async registerUser(@Req() req: Request, @Body() userDto: SignUpUserDto) {
    const { email, secret, alias, fullname, profileId, ...customerInfo } =
      userDto;

    const user = await this.usersService.createUser({
      alias,
      email,
      secret,
      fullname,
      profileId,
    });

    const splittedName = fullname.split(' ');

    const customer = await this.customersService.createCustomer({
      userId: user.id,
      email: user.email,
      fullname: fullname,
      firstname: splittedName[0],
      lastname:
        splittedName.length - 1 > 0
          ? splittedName[splittedName.length - 1]
          : undefined,
      ...customerInfo,
    });

    const clientAddress = req.ip;

    const { token } = await this.authService.signIn(
      {
        username: email,
        secret,
      },
      clientAddress,
    );

    return {
      userId: user.id,
      alias: user.alias,
      email: user.email,
      customerId: customer.id,
      token,
    };
  }

  @Get('availability')
  async checkAvailability(
    @Query('email') email: string,
    @Query('alias') alias = undefined,
  ) {
    try {
      return this.usersService.checkUserAvailability({ email, alias });
    } catch (err) {
      console.error('Falha ao verificar disponibilidade do usuário >>>', err);
      return {
        err: 'Falha ao verificar disponibilidade do usuário',
      };
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(UserEntity.permissions.find, CustomerEntity.permissions.find)
  async getUserById(@Param('id') userId: string) {
    try {
      return await this.usersService.findById(userId);
    } catch (err) {
      console.error('Falha ao buscar usuário >>>', err);
      return {
        err: 'Falha ao buscar usuário',
      };
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions(UserEntity.permissions.delete, CustomerEntity.permissions.delete)
  async removeUser(@Req() req: Request, @Param('id') userId: string) {
    try {
      return await this.usersService.excludeUser(userId, {
        id: req.user.id,
        address: req.ip,
      });
    } catch (err) {
      console.error('FALHA AO EXCLUIR USUÁRIO >>>', err);
      return {
        err: 'FALHA AO EXCLUIR USUÁRIO',
      };
    }
  }
}
