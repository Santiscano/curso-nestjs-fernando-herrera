import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  controllers: [ CarsController ],
  providers: [ CarsService ],
  exports: [ CarsService ] // se exporta para que puedan acceder a el desde otros modulos
})
export class CarsModule {}
