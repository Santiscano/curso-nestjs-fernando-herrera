import { join } from 'path'; // en Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    
    ServeStaticModule.forRoot({ // servir archivos estaticos
      rootPath: join(__dirname,'..','public'), 
    }),

    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'), // conexion base de datos

    PokemonModule,

    CommonModule,

  ],
})
export class AppModule {}
