import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars') // ruta principal de todos los metodos
export class CarsController {
  
  constructor(
    private readonly carsService: CarsService //inyecion de dependencias es decir instancia la clase del servicio
  ) {}

  @Get() // decorador que define el tipo de peticion y ruta
  getAllCars() {
    return this.carsService.findAll()
  }

  @Get(':id')
  getCarById( @Param('id', ParseIntPipe ) id: number ) {
    // @Param recibe el parametro y tambien lo parsea a numero
    return this.carsService.findOneById( id );
  }

  @Post()
  createCar( @Body() body: any ) { // extrae el body de la solicitud
    return body;
  }

  @Patch(':id')
  updateCar( 
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: any
  ) 
  {
    return body;
  }

  @Delete(':id')
  deleteCar( @Param('id', ParseIntPipe ) id: number ) {
    return {
      method: 'delete',
      id
    };
  }


}
