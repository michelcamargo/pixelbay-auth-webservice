import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { winstonLogger } from '../../config/app/winston.config';
import ConsoleHelper from '../helpers/console.helper';

@Injectable()
class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const now = Date.now();

    ConsoleHelper.logRequest(request);

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const { statusCode } = response;
        if (statusCode !== 200 && statusCode !== 201) {
          ConsoleHelper.logResponse(response);
        }

        winstonLogger.info(
          `${method} ${url} ${statusCode} ${Date.now() - now}ms`,
        );
      }),
    );
  }
}

export default LoggingInterceptor;
