import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as expressWinston from 'express-winston';
import * as winston from 'winston';

@Injectable()
export class WinstonMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    expressWinston.logger({
      transports: [
        new winston.transports.Console({ handleExceptions: true }),
        // new winston.transports.File({ filename: './logs/request.log' }),
      ],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
      ),
      meta: true,
      msg: 'HTTP {{req.method}} {{req.url}}',
      expressFormat: true,
      colorize: false,
      requestWhitelist: ['url', 'method', 'originalUrl', 'query'],
      dynamicMeta: (req, _res) => ({ user: req.user }), // add metadados dinâmicos
      ignoreRoute: (_req, _res) => false,
    })(req, res, next);
  }
}
