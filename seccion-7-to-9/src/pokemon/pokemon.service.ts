import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose'; // para poder usar un schema de mongo

import { isValidObjectId, Model } from 'mongoose'; // model refiere al tipado
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    
    @InjectModel( Pokemon.name ) // InjectModel se trae de nest/mongoose, y es necesario para inyectar el pokemonModel
    private readonly pokemonModel: Model<Pokemon>, // pokemon es referencia de entity, model de mongoose

    private readonly configService: ConfigService,

  ) {
    
    this.defaultLimit = configService.get<number>('defaultLimit') ;
    // console.log({ defaultLimit: configService.get<number>('defaultLimit') })
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {
      this.handleExceptions( error );
    }

  }

  findAll( paginationDto: PaginationDto ) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no: 1
      })
      .select('-__v'); // elimina de la respuesta el "__v"
      
  }

  async findOne(term: string) {
    // aqui se hace el ejercicio de validar el termino de diferentes maneras para poder buscar
    let pokemon: Pokemon;

    if ( !isNaN(+term) ) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoID
    if ( !pokemon && isValidObjectId( term ) ) { // isValidObjectId viene de mongoose para validar si es un id de mongo
      pokemon = await this.pokemonModel.findById( term );
    }

    // Name
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }


    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);
    

    return pokemon;
  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );
    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      await pokemon.updateOne( updatePokemonDto ); // metodo de mongo para actualizar el pokemon
      return { ...pokemon.toJSON(), ...updatePokemonDto }; // esto se hace porque el update de mongo no devuelve la nueva actualizacion, entonces si no revienta quiere decir que si actualizo, y en teoria esto seria la actualizacion
      
    } catch (error) {
      this.handleExceptions( error ); // esto es una funcion global para no repetir codigo
    }
  }

  async remove( id: string) {
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // *con las 2 lineas anteriores podria enviarse cualquier cosa, nombre, id, u otra propiedad y asi lo identificaria y eliminaria

    // return { id }; // *esto se hizo para validar el tipo de dato
    // const result = await this.pokemonModel.findByIdAndDelete( id ); // *con esta se podria hacer todo de 1 sola consulta, pero puede generar falsos positivos cuando el id no existe y retorna 200

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id }); //* aqui comparo id que recibo con id de mongo, pero este regresa un objeto con registros eliminados, asi que si su valor es cero podria definir que no se elimino nada
    if ( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);

    return;
  }


  private handleExceptions( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }

}
