import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

import { ApikeyGuard } from './auth/guards/apikey.guard';

@UseGuards(ApikeyGuard) // poniendolo aqui todos los metodos del controlador estan protegidos por el guard
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @SetMetadata('isPublic', true) // con esto se le dice a nest que este metodo no necesita autenticacion
  @Public() // este es un decorador personalizado que hace lo mismo que el de arriba pues se configuro para evitar correr el riesgo de escribirlo mal
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('nuevo')
  @Public()
  newEndpoint() {
    return 'yo soy nuevo';
  }

  @Get('/ruta/')
  hello() {
    return 'con /sas/';
  }

  @Get('tasks')
  tasks() {
    return this.appService.getTasks();
  }
}
