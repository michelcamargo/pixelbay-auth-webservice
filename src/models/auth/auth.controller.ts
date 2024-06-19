import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto/signup-user.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import ExceptionInterceptor from '../../common/interceptors/exception.interceptor';

@Controller('')
@UseInterceptors(ExceptionInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async login(@Body() userDto: SignInUserDto) {
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
