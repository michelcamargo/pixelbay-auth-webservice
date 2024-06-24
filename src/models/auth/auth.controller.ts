import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto } from './dto/signin-user.dto';
import ExceptionInterceptor from '../../common/interceptors/exception.interceptor';
import { Request } from 'express';

@Controller('auth')
@UseInterceptors(ExceptionInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
