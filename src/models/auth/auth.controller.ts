import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import ExceptionInterceptor from '../../common/interceptors/exception.interceptor';

@Controller('auth')
@UseInterceptors(ExceptionInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('availability')
  async checkAvailability(
    @Query('email') email: string,
    @Query('alias') alias = undefined,
  ) {
    try {
      return this.authService.checkUserAvailability({ email, alias });
    } catch (err) {
      console.error('Falha ao verificar disponibilidade do usuário >>>', err);
      return {
        err: 'Falha ao verificar disponibilidade do usuário',
      };
    }
  }

  @Post('signup')
  async signUp(@Body() userDto: SignUpUserDto) {
    try {
      return this.authService.signUp(userDto);
    } catch (err) {
      console.error('FALHA AO CRIAR USUÁRIO >>>', err);
      return {
        err: 'FALHA AO CRIAR USUÁRIO',
      };
    }
  }

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
