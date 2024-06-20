import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
class RootExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: number;
    let message: string | Record<string, any>;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = this.extractErrorMessage(exceptionResponse);
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';

      if (exception instanceof Error) {
        message = exception.message;
      }
    }

    console.error('Exception caught:', exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }

  private extractErrorMessage(exceptionResponse: any): string {
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      if (exceptionResponse.message) {
        return exceptionResponse.message;
      }
      if (exceptionResponse.error) {
        return exceptionResponse.error;
      }
    }
    return exceptionResponse.toString();
  }
}

export default RootExceptionsFilter;
