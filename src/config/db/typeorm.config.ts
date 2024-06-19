import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

// const configService = new ConfigService();
// const dataSource = new DataSource({
//   type: 'postgres',
//   host: configService.get('DB_HOST'),
//   port: configService.get('DB_PORT'),
//   username: configService.get('DB_USERNAME'),
//   password: configService.get('DB_PASSWORD'),
//   database: configService.get('DB_DATABASE'),
//   entities: [User, Customer, Address],
//   migrations: ['dist/migrations/*.js'],
//   synchronize: false, // deve ser false em produção
// });

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
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
    synchronize: true, // Deve ser false em produção
    logging: true,
  };
};
