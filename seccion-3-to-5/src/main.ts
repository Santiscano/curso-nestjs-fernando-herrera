import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes( // es un pipe global de validaciones
    new ValidationPipe({
      whitelist: true, // elimina la data que no espero, solo deja la esperada
      forbidNonWhitelisted: true, // genera el error si envia datos que no espero
      // existen mas opciones de configuracion para explorar
    }),
  )


  await app.listen(3000);
}
bootstrap();
