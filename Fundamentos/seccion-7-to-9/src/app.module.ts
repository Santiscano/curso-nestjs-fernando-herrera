import { join } from 'path'; // en Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static'; // hay que instalarlo y es para archivos estaticos
import { MongooseModule } from '@nestjs/mongoose'; //
import { ConfigModule } from '@nestjs/config';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [
    
    ConfigModule.forRoot({ // hay que instalar la libreria y luego llamarlo asi
      load: [ EnvConfiguration ], // esto es una funcion que contiene los valores del process.env o definidos por defecto
      validationSchema: JoiValidationSchema,
    }),
    
    // servir contenido estatico, requiere la instalacion del @nestjs/serve-static
    ServeStaticModule.forRoot({ 
      rootPath: join(__dirname,'..','public'), 
    }),

// -- select url, 'http://localhost:3000/api/files/product/' || url from product_images;

// -- update product_images set url = 'http://localhost:3000/api/files/product/' || url


    // conexion raiz de mongo
    MongooseModule.forRoot( process.env.MONGODB, {
      dbName: 'pokemonsdb'
    }),
    
    PokemonModule,

    CommonModule,

    SeedModule,

  ],
})
export class AppModule {}
