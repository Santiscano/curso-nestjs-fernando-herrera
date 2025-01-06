import { Module,
  // HttpModule, HttpService
 } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { lastValueFrom } from 'rxjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { enviroments } from './enviroments';
import { AuthModule } from './auth/auth.module';
import { SumService } from './testing/sum/sum.service';
import { MatchesService } from './testing/matches.service';
import { SetupTeardownService } from './testing/setup-teardown.service';
import config from './config';

@Module({
  // *en los imports se importan los modulos que se van a utilizar en la aplicacion, en el caso de app.module se importan los modulos raiz, por ejemplo productos, usuarios, etc
  imports: [
    // ConfigModule.forRoot() es un decorador que permite cargar variables de entorno y configuraciones de la aplicación en un módulo de NestJS.
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.env', // carga las variables de entorno según el archivo indicado, en este caso se creo como primer opcion un archivo enviroments.ts que contiene las rutas de los archivos segun un ambiente, si no se encuentra el archivo se carga el archivo .env
      load: [config], // carga las variables de entorno definidas en el archivo config.ts, en este caso se carga el archivo config.ts que es como una capa de abstracción para las variables de entorno que contiene las variables de entorno que se llaman.
      isGlobal: true, // permite que las variables de entorno estén disponibles en toda la aplicación
      validationSchema: Joi.object({ // valida las variables de entorno con Joi
        API_KEY: Joi.string().required(), // valida que la variable de entorno API_KEY sea un número y sea requerida
        DATABASE_NAME: Joi.string().required(), // valida que la variable de entorno DATABASE_NAME sea un string y sea requerida
        DATABASE_PORT: Joi.number().required(), // valida que la variable de entorno DATABASE_PORT sea un número y sea requerida
      }),
    }),
    HttpModule, // importa el módulo HttpModule para realizar peticiones HTTP

    // de aqui para abajo se importan los modulos desarrollados por mi para la aplicacion
    UsersModule,
    ProductsModule,
    DatabaseModule,
    AuthModule,
  ],
  // *en los controllers se importan los controladores que se van a utilizar en la aplicacion, esto casi siempre es vacio, porque cada modulo tiene su propio controlador
  controllers: [AppController],
  // *en los providers se importan los servicios que se van a utilizar en la aplicacion
  providers: [
    AppService,
    // de la siguiente forma se configurar para poder hacer peticiones http
    {
      provide: 'TASKS', // define el nombre del proveedor de la petición HTTP
      // useFactory es un método que permite realizar una petición HTTP y retornar los datos de la petición como un proveedor de la aplicación.
      // forma de la version 7 o anteriores
      // useFactory: async (http: HttpService) => { // recibe como argumento el servicio HttpService
      //   const tasks = await http // realiza una petición HTTP a la URL https://jsonplaceholder.typicode.com/todos
      //     .get('https://jsonplaceholder.typicode.com/todos')
      //     .toPromise();
      //   return tasks.data; // retorna los datos de la petición HTTP
      // },

      // !forma de la version 7 o superiores de rxjs en este caso no sirve
      useFactory: async (http: HttpService) => {
        const request = http.get('https://jsonplaceholder.typicode.com/todos');
        const tasks = await lastValueFrom(request);
        return tasks.data;
      },
      inject: [HttpService], // inyecta el servicio HttpService en el proveedor de la petición HTTP para realizar la petición HTTP en el useFactory anteriormente escrito
    },
    SumService,
    MatchesService,
    SetupTeardownService,
  ],
})
export class AppModule {}
