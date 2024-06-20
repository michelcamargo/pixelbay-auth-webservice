import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { winstonLogger } from '../../config/app/winston.config';

@Injectable()
class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers, body, query, params, ip } = request;

    console.log(
      JSON.stringify(
        {
          [method]: url,
          headers: {
            host: headers['host'],
            userAgent: headers['user-agent'],
          },
          body,
          query,
          params,
          ip,
          timestamp: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    return next.handle().pipe(
      tap(() => {
        // const response = context.switchToHttp().getResponse();
        // const statusCode = response.statusCode;
        //
        // winstonLogger.info(
        //   `${method} ${url} ${statusCode} ${Date.now() - now}ms`,
        // );
      }),
    );
  }
}

export default LoggingInterceptor;
