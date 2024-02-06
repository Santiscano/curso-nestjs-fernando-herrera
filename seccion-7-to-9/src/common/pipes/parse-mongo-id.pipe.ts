import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  
  // se encarga de transformar datos o de validar la data
  transform(value: string, metadata: ArgumentMetadata) {
    // console.log({ value, metadata }); // la metadata es algo a explorar para mirar que se puede lograr con los pipes
    
    if ( !isValidObjectId(value) ) { // valida que sea mongo id con la funcion de mongoose
      throw new BadRequestException(`${ value } is not a valid MongoID`); // sino es mongoId genera un error
    }

    return value;
  }


}
