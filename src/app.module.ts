import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './models/auth/auth.module';
import appConfig from './config/app/app.config';
import typeOrmConfig from './config/db/typeorm.config';
import { WinstonModule } from 'nest-winston';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import LoggingInterceptor from './common/interceptors/logging.interceptor';
import * as winston from 'winston';
import { WinstonMiddleware } from './common/middlewares/winston.middleware';
import RootExceptionsFilter from './common/filters/root-exceptions.filter';
import { AppController } from './app.controller';
import { UsersModule } from './models/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    WinstonModule.forRoot({
      transports: [
        // new winston.transports.Console({ handleExceptions: true }),
        new winston.transports.File({ filename: './logs/application.log' }),
      ],
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: RootExceptionsFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(WinstonMiddleware).forRoutes('*');
  }
}
