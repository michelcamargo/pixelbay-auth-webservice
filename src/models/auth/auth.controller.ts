import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from '@michelcamargo/website-shared';
import ExceptionInterceptor from '../../common/interceptors/exception.interceptor';
import { Request } from 'express';

@Controller('auth')
@UseInterceptors(ExceptionInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('handshake/:user')
  async handshake(@Param('user') user: string) {
    try {
      return this.authService.handshake(user);
    } catch (err) {
      console.error('Falha ao checar usuário >>>', err);
      return {
        err: 'FALHA AO REALIZAR LOGIN',
      };
    }
  }

  @Post('signin')
  async signIn(@Req() req: Request, @Body() userDto: SignInUserDto) {
    try {
      return this.authService.signIn(userDto, req.ip);
    } catch (err) {
      console.error('FALHA AO REALIZAR LOGIN >>>', err);
      return {
        err: 'FALHA AO REALIZAR LOGIN',
      };
    }
  }
}
