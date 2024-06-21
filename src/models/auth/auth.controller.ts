import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from '../users/dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import ExceptionInterceptor from '../../common/interceptors/exception.interceptor';
import { UsersService } from '../users/users.service';

@Controller('auth')
@UseInterceptors(ExceptionInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() userDto: SignInUserDto) {
    try {
      return this.authService.signIn(userDto);
    } catch (err) {
      console.error('FALHA AO REALIZAR LOGIN >>>', err);
      return {
        err: 'FALHA AO REALIZAR LOGIN',
      };
    }
  }
}
