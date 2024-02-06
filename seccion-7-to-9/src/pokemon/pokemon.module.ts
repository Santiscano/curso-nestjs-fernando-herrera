import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [ PokemonController ],
  providers: [ PokemonService ],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([ 
      {
        name: Pokemon.name, // este pokemon viene de las entity
        schema: PokemonSchema,
      },
      // {} // otros modelos y schemas
    ])
  ],
  exports: [
    MongooseModule // se exporta el mongoose es porque lo que se utilizara es los metodos de insert
  ]
})
export class PokemonModule {}
