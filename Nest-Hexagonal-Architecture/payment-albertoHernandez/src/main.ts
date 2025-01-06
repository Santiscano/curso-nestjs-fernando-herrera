import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { ErrorResponseNormalizerFilter } from "@/src/app/http-api/response-normalizer/error-response-normalizer.filter";
import { SuccessResponseNormalizerInterceptor } from "@/src/app/http-api/response-normalizer/success-response-normalizer.interceptor";
import { API } from "@/src/app/http-api/routes/route.constants";

import { Logger } from "@/shared/logger/domain";
import { LoggerInterceptor } from "@/shared/logger/infrastructure/logger.interceptor";
import { NestLoggerService } from "@/shared/logger/infrastructure/nestjs.logger-service";

import { AppModule } from "./app/app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>( // NestFactory.create crea una instancia de la aplicación Nest, NestFastifyApplication es una subclase de INestApplication que proporciona una capa de abstracción sobre la aplicación Fastify
    AppModule, // AppModule es el módulo raíz de la aplicación donde se registran todos los módulos y servicios
    new FastifyAdapter(), // FastifyAdapter es una implementación de la interfaz HttpAdapter que se utiliza para crear una aplicación Fastify
    { bufferLogs: true }, // Opciones de configuración de la aplicación Fastify que se pasan al constructor de FastifyAdapter para configurar la aplicación Fastify subyacente
  );
  app.useLogger(app.get(NestLoggerService)); // app.useLogger registra un servicio de registro personalizado en la aplicación
  app.setGlobalPrefix(API);

  app.useGlobalFilters(app.get(ErrorResponseNormalizerFilter)); // app.useGlobalFilters registra un filtro global en la aplicación que se ejecuta antes de que se envíe una respuesta al cliente
  app.useGlobalInterceptors(
    app.get(LoggerInterceptor),
    app.get(SuccessResponseNormalizerInterceptor),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT", "3000");
  const logger = app.get(Logger);

  await app.listen(port, "0.0.0.0");

  logger.info(`App is ready and listening on port ${port} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  // eslint-disable-next-line no-console
  console.error(error);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(1);
}

process.on("uncaughtException", handleError);
