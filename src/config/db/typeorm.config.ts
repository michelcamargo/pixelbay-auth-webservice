import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const typeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProductionEnv = configService.get<string>('APP_ENV') === 'production';

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
    synchronize: !isProductionEnv,
    logging: false,
  };
};

export default typeOrmConfig;
