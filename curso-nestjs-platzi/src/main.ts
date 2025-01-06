import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ // esta clase es un interceptor que permite validar los datos de entrada de las peticiones HTTP según las reglas definidas en los DTOs (Data Transfer Object)
      whitelist: true, // elimina las propiedades que no están definidas en el DTO (Data Transfer Object)
      forbidNonWhitelisted: true, // evita que se envíen propiedades que no están definidas en el DTO, generando un error 400
      transformOptions: {
        // convierte automáticamente los tipos de datos de las propiedades del DTO a los tipos de datos especificados en el DTO, por ejemplo, si se envía un string en un campo que debería ser de tipo number, lo convierte automáticamente a number y no genera un error de validación.
        enableImplicitConversion: true, // por ejemplo cuando tengo un objeto Query que internamente tiene varios, por ejemplo en el caso de productos con el limit y offset, si se envía un string en un campo que debería ser de tipo number, lo convierte automáticamente a number y no genera un error de validación.
      },
    }),
  );
  // intercepta las respuestas de la API y aplica la serialización de los objetos de salida según la configuración de la clase de los DTOs (Data Transfer Object) y las entidades.
  // es decir, en palabras simples, si se tiene una entidad o DTO con propiedades privadas, estas no se mostrarán en la respuesta de la API.
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // configuración de la documentación de la API con Swagger y OpenAPI (OpenAPI es una especificación para describir y documentar APIs RESTful)
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('PLATZI STORE')
    .setVersion('1.0')
    .build(); // configuración de la documentación de la API
  const document = SwaggerModule.createDocument(app, config); // crea la documentación de la API
  SwaggerModule.setup('docs', app, document); // ruta para acceder a la documentación
  app.enableCors(); // permite que todos los dominios puedan acceder a la API
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
