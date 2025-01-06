import { OrderStatus } from '@prisma/client';


export const OrderStatusList = [
  OrderStatus.PENDING, // esto se puede importar ya que estan en el schema.prisma y cuando se hace la migracion se guardan en @prisma/client y desde ahi se pueden importar
  OrderStatus.DELIVERED,
  OrderStatus.CANCELLED,
]
