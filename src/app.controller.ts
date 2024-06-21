import {
  Controller,
  Get,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import ExceptionInterceptor from './common/interceptors/exception.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { Permissions } from './common/decorators/permissions.decorator';

@Controller()
@UseInterceptors(ExceptionInterceptor)
export class AppController {
  constructor() {}

  @Get('healthcheck')
  async healthCheck() {
    try {
      return {
        message: 'Ready',
      };
    } catch (err) {
      return {
        message: 'Error',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @Permissions('read', 'write')
  getProfile(@Request() req: any) {
    return req.user;
  }
}
