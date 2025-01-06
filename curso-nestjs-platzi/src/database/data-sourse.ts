import { DataSource } from 'typeorm';

export const dataSource: DataSource = {
  type: 'mysql',
  // opcion 1 para configurar la conexion
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'test',
  // opcion 2 para configurar la conexion
  // url: 'mysql://root:password@localhost:3306/test',
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
};
