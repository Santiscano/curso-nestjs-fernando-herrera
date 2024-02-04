import { IsString } from 'class-validator';

export class CreateCarDto {

    @IsString()
    readonly brand: string;

    @IsString()
    // aqui se pueden agregar mas decoradores del class-validator
    readonly model: string;

}