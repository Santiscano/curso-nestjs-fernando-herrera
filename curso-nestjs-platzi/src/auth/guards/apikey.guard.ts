import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import { Observable } from 'rxjs';

import config from './../../config';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

import { Request } from 'express';

@Injectable()
export class ApikeyGuard implements CanActivate {
  /**
   *
   * @param reflector se usa para obtener los metadatos de la ruta, en este caso si es publica o no
   * @param configService
   */
  constructor(
    private reflector: Reflector,
    @Inject(config.KEY) private configService: ConfigType<typeof config> // inyecta la variable de entorno traida desde config
  ) {}

  /**
   * este metodo se encarga de validar si el usuario puede acceder a la ruta validando el apikey
   * se pone en un controller usando @UseGuards(ApikeyGuard)
   * @param context
   * @returns {boolean | Promise<boolean> | Observable<boolean>} una respuesta  booleana para validar si el usuario puede acceder a la ruta
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) { // el reflector valida si es publico y de serlo retorna true directamente
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>(); // obtenemos el objeto de la peticion del contexto y se tipa con el Request de express
    const authHeader = request.header('Auth'); // esto es como se obtiene los headers del request igual a express
    const isAuth = authHeader === this.configService.apiKey; // comparo si el auth es igual a mi apikey
    if (!isAuth) {
      throw new UnauthorizedException('not allow');
    }
    return isAuth; // si es igual retorno true y le la permisos en la ruta.
  }
}
