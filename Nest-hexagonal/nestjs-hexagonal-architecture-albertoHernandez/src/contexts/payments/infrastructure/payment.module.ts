import { Module } from "@nestjs/common";

import { CreatePaymentUseCase } from "@/contexts/payments/application/create-payment-use-case/create-payment.use-case";
import { FindPaymentByIdUseCase } from "@/contexts/payments/application/find-payment-by-id-use-case/find-payment-by-id.use-case";
import { PaymentRepository } from "@/contexts/payments/domain/payment.repository";
import { CreatePaymentController } from "@/contexts/payments/infrastructure/http-api/v1/create-payment/create-payment.controller";
import { FindPaymentByIdController } from "@/contexts/payments/infrastructure/http-api/v1/find-payment-by-id/find-payment-by-id.controller";
import { InMemoryPaymentRepository } from "@/contexts/payments/infrastructure/repositories/in-memory.payment-repository";

@Module({
  controllers: [CreatePaymentController, FindPaymentByIdController],
  providers: [
    CreatePaymentUseCase,
    FindPaymentByIdUseCase,
    InMemoryPaymentRepository,
    /**
     * esta es la forma de utilizar inyección de dependencias en NestJS haciendo que se separe la definición de la implementación,
     * ya que cuando se llame al repositorio que es una clase abstracta,
     * se le dirá que utilice la implementación de InMemoryPaymentRepository que es la que tiene la lógica de negocio.
     * y esto seria un patron de diseño de inyección de dependencias "Singleton"
    */
    {
      provide: PaymentRepository,
      useExisting: InMemoryPaymentRepository,
    },
  ],
  exports: [CreatePaymentUseCase, FindPaymentByIdUseCase],
})
export class PaymentModule {}
