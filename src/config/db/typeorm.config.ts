import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import * as fs from 'node:fs';

const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProd = configService.get<string>('APP_ENV') === 'production';
  let sslCert: Buffer | false = false;

  if (isProd) {
    try {
      sslCert = fs.readFileSync(
        join(__dirname, '../..', 'cert/pg-pb.crt').toString(),
      );
    } catch (e) {
      console.error('Certificado SSL não encontrado em:', e?.path);
    }
  }

  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [
      join(__dirname, '../..', 'models', '*', 'entities', '*.{ts,js}'),
    ],
    migrationsTableName: 'migrations',
    migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
    autoLoadEntities: true,
    synchronize: !isProd,
    logging: false,
    ssl: sslCert ? { ca: sslCert } : false,
  };
};

export default typeOrmConfig;
