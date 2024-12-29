import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { NatsModule } from 'src/transports/nats.module';

// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ORDER_SERVICE } from 'src/config';

@Module({
  controllers: [OrdersController],
  imports: [NatsModule],
  // imports: [
  //   ClientsModule.register([
  //     {
  //       name: ORDER_SERVICE, // este nombre es por el cual se inyecta el cliente en el controller
  //       transport: Transport.TCP,
  //       options: {
  //         host: 'localhost',
  //         port: 3002,
  //       },
  //     },
  //   ]),
  // ],
})
export class OrdersModule {}
