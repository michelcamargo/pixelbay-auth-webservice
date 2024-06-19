// import { WinstonModuleOptions } from 'nest-winston';
// import * as winston from 'winston';
//
// export const winstonConfig: WinstonModuleOptions = {
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.colorize(),
//         winston.format.printf(({ timestamp, level, message, context }) => {
//           return `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
//         }),
//       ),
//     }),
//     new winston.transports.File({
//       filename: 'application.log',
//       format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json(),
//       ),
//     }),
//   ],
// };

import * as winston from 'winston';

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'application.log' }),
  ],
});
