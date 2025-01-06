import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { NatsModule } from 'src/transports/nats.module';

// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { PRODUCT_SERVICE } from 'src/config';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [NatsModule],
  // import: [
  //   ClientsModule.register([
  //     {
  //       name: PRODUCT_SERVICE,
  //       transport: Transport.TCP,
  //       options: {
  //         host: 'localhost',
  //         port: 3001
  //       }
  //     }
  //   ])
  // ]
})
export class OrdersModule {}
