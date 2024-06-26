import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export default registerAs('app', () => {
  return {
    env: process.env.APP_ENV,
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    port: process.env.PORT,
  };
});
