import { Injectable, ExecutionContext, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor( private reflector: Reflector ) { // reflector es un servicio que nos permite acceder a los metadatos de los controladores y los manejadores de los metodos
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if ( isPublic ) return true;

    return super.canActivate(context); // usar solo esta linea seria como no tener el guardian, el objetivo es que primero se ejecute el guardian y luego se ejecute el handler
  }

  /**
   * Este metodo se encarga de manejar la respuesta de la peticion y verificar si el usuario esta autorizado o no, se utiliza para manejar los errores de la peticion y retornar un mensaje personalizado en caso de que el usuario no este autorizado o no exista
   * @param err
   * @param user
   * @param info
   * @param context
   * @param status
   * @returns
   */
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    if (err || !user) {
      throw new HttpException({
          status: HttpStatus.UNAUTHORIZED,
          error: 'Usuario no autorizado',
        },
        HttpStatus.UNAUTHORIZED
      );
    }
    return user;
  }
}
