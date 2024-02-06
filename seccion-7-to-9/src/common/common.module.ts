
import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    providers: [ AxiosAdapter ], // indicamos los servicios del modulo
    exports: [ AxiosAdapter ] // indicamos que servicios exportar
})
export class CommonModule {}
