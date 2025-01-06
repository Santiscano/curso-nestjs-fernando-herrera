// import { OrderStatus } from '@prisma/client';
// import { OrderStatusList } from '../enum/order.enum';
// import { IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';

import { OrderItemDto } from './order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true }) // valida que cada item del array sea un objeto de tipo OrderItemDto
  @Type(() => OrderItemDto)
  items: OrderItemDto[];


  // @IsNumber()
  // @IsPositive()
  // totalAmount: number;

  // @IsNumber()
  // @IsPositive()
  // totalItems: number;

  // @IsEnum( OrderStatusList, {
  //   message: `Possible status values are ${ OrderStatusList }`
  // })
  // @IsOptional()
  // status: OrderStatus = OrderStatus.PENDING

  // @IsBoolean()
  // @IsOptional()
  // paid: boolean = false;
}
