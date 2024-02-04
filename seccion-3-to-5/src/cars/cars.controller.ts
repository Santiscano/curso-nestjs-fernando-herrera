import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars') // ruta principal de todos los metodos
// @UsePipes( ValidationPipe ) // este pipe hace la validacion para este controllador, pero en este caso se pone global para mayor acceso de la api
export class CarsController {
  
  constructor(
    private readonly carsService: CarsService //inyecion de dependencias es decir instancia la clase del servicio
  ) {}

  @Get() // decorador que define el tipo de peticion y ruta
  getAllCars() {
    return this.carsService.findAll();
  }

  @Get(':id')
  getCarById( @Param('id', ParseUUIDPipe ) id: string ) {
    // @Param recibe el parametro y tambien lo parsea en este caso a UUID
    // tambuen es posible definir la version asi: new ParseUUIDPipe({ version:'5' })
    return this.carsService.findOneById( id );
  }

  @Post()
  // @UsePipes( ValidationPipe ) // aqui solo hubiera validado aqui y se tendria que repetir en cada parte de su uso
  createCar( @Body() createCardDto: CreateCarDto ) { // extrae el body de la solicitud
    return this.carsService.create( createCardDto );
  }

  @Patch(':id')
  updateCar( 
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateCarDto: UpdateCarDto ) 
  {
    return this.carsService.update( id, updateCarDto );
  }

  @Delete(':id')
  deleteCar( @Param('id', ParseUUIDPipe ) id: string ) {
    return this.carsService.delete( id )
  }

}
