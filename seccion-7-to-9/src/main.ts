import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2'); // especifica el prefijo general

  app.useGlobalPipes( // es un pipe global de validaciones
    new ValidationPipe({
      whitelist: true, // elimina la data que no espero, solo deja la esperada
      forbidNonWhitelisted: true, // genera el error si envia datos que no espero
      transform: true, // permite la transformacion de los DTO para los que recibe como parametros o body
      transformOptions: {
        enableImplicitConversion: true, // esta tambien es necesaria para la transformacion de DTO's
      }
    })
  );


  await app.listen( process.env.PORT );
  console.log(`App running on port ${ process.env.PORT }`)
}
bootstrap();
