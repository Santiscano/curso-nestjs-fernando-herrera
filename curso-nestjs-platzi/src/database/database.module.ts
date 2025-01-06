import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config';

const API_KEY = '12345634';
const API_KEY_PROD = 'PROD1212121SA';

// client.query('SELECT * FROM tasks', (err, res) => {
//   console.error(err);
//   console.log(res.rows);
// });

@Global()
@Module({
  imports: [
    // typeOrmModule es un modulo que ya existe en nestjs, se usa es la importacion porque se esta es indicando que se va a usar un modulo y asi se importara de manera global
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { user, host, dbName, password, port } = configService.postgres;
        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database: dbName,
          synchronize: false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [
    // usar este provaider para inyectar la variable de entorno es similar a haber creado un archivo .services.ts y haberlo importado en el modulo
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    // igualmente con pg, al hacerlo asi, es como si se tuviera un archivo .services.ts y se importara en el modulo este service es el que tiene la conexion a la base de datos por medio de la libreria pg
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const { dbName, host, password, port, user } = configService.postgres;
        const client = new Client({
          user,
          host,
          database: dbName,
          password,
          port,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  // con este export lo que se esta haciendo es exportar las variables que se inyectaron en el modulo, para que puedan ser usadas en otros modulos
  // y al importar database.module.t en app.module.ts se pueden inyectar las variables en todos los modulos que se importen en app.module.ts
  exports: ['API_KEY', 'PG', TypeOrmModule],
})
export class DatabaseModule {}
