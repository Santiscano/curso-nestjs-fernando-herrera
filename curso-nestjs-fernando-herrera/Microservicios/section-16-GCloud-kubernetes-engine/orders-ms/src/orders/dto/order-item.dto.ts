import { IsNumber, IsPositive } from 'class-validator';
// import { Type } from 'class-transformer';


export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  // @Type(() => number) // esto seria una opcion si se quiere aceptar strings e intentar convertirlos a numeros, pero no es recomendable hacerlo
  price: number;
}
