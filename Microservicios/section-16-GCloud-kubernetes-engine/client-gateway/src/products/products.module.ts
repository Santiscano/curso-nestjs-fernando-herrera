import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { NatsModule } from 'src/transports/nats.module';

// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { PRODUCT_SERVICE } from 'src/config';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [NatsModule],
  // imports: [
  //   ClientsModule.register([
  //     {
  //       name: PRODUCT_SERVICE, // este nombre es por el cual se inyecta el cliente en el controller
  //       transport: Transport.TCP,
  //       options: {
  //         host: 'localhost',
  //         port: 3001,
  //       },
  //     },
  //   ]),
  // ],
})
export class ProductsModule {}
