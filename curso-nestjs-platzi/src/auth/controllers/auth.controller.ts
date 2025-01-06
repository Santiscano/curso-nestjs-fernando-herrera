import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './../services/auth.service';
import { User } from './../../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // con el useGuards se indica que tiene que pasar la validacion del guardian
  // y en el AuthGuard se le indica el nombre que se le dio a la estrategia en el strategy
  // la funcion validate del strategy se ejecuta automaticamente y valida en este caso el usuario y contraseña y de ser exitoso retorna el usuario
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    const user = req.user as User;
    return this.authService.generateJWT(user);
  }
}
