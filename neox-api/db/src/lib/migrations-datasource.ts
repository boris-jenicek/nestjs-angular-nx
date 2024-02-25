// eslint-disable-next-line @nx/enforce-module-boundaries
import { ExposedEntities } from '@neox-api/endpoints';
import { DataSource } from 'typeorm';

// datasource for migrations
export const migrationsDataSource = new DataSource({
  type: 'postgres',
  host: process.env['DB_HOST'] || 'localhost',
  port: parseInt(process.env['DB_PORT'], 10),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
  entities: ExposedEntities,
  logging: true,
  migrations: [`${__dirname}/../migrations/*{.ts,.js}`],
});
