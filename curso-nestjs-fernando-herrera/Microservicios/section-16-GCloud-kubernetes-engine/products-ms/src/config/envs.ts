import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;

  NATS_SERVERS: string[];
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),

  NATS_SERVERS: joi.array().items( joi.string() ).required(),
})
.unknown(true); // Permite propiedades no definidas en el esquema

const { error, value } = envsSchema.validate({ 
  ...process.env, //Carga las variables de entorno para validarlas
  NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
});


if ( error ) { // si hay un error en la validación del esquema genera un error
  throw new Error(`Config validation error: ${ error.message }`);
}

const envVars:EnvVars = value;


export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,

  natsServers: envVars.NATS_SERVERS,
}