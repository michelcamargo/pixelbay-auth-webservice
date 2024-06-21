import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import ExceptionInterceptor from '../../common/interceptors/exception.interceptor';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { PbEntity } from '../../common/entities/base.entity';
import { SignUpUserDto } from './dto/signup-user.dto';
import { CustomersService } from '../customers/customers.service';

@Controller('users')
@UseInterceptors(ExceptionInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly customersService: CustomersService,
  ) {}

  @Post()
  async registerUser(@Body() userDto: SignUpUserDto) {
    try {
      const { email, secret, alias, fullname, ...customerInfo } = userDto;
      const user = await this.usersService.createUser({
        alias,
        email,
        secret,
        fullname,
      });

      const customer = await this.customersService.createCustomer({
        user_id: user.id,
        email: user.email,
        fullname: fullname,
        ...customerInfo,
      });

      const { access_token } = await this.authService.signIn({
        username: email,
        secret,
      });

      return {
        ...PbEntity.pick(user, ['id', 'alias', 'email', 'client_id']),
        customer_id: customer.id,
        access_token,
      };
    } catch (err) {
      console.error('FALHA AO REALIZAR LOGIN >>>', err);
      return {
        err: 'FALHA AO REALIZAR LOGIN',
      };
    }
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

  // @Delete(':id') id: string;
  // async removeUser(@Body() userDto: SignInUserDto) {
  //   try {
  //     return this.usersService.excludeUser(userDto);
  //   } catch (err) {
  //     console.error('FALHA AO REALIZAR LOGIN >>>', err);
  //     return {
  //       err: 'FALHA AO REALIZAR LOGIN',
  //     };
  //   }
  // }
}
