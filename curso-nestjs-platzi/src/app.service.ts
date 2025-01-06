import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';
import config from './config';

@Injectable()
export class AppService {
  constructor(
    // @Inject('API_KEY') private apiKey: string,
    @Inject('PG') private clientPg: Client,
    @Inject('TASKS') private tasks: any[], // aqui inyectamos el resultado de la peticion http
    @Inject(config.KEY) private configService: ConfigType<typeof config>, // inyectamos la configuracion de la aplicacion desde el archivo config.ts es decir las variables de entorno
  ) {}
  getHello(): string {
    const apiKey = this.configService.apiKey; // aqui accedemos a la variable de entorno apiKey
    const name = this.configService.database.name; // aqui accedemos a la variable de entorno database.name
    return `Hello World! ${apiKey} ${name}`; // retornamos el mensaje con las variables de entorno
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      this.clientPg.query('SELECT * FROM tasks', (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res.rows);
      });
    });
  }
}
