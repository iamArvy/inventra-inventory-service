import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { UpdateStockDto } from '../dto';
import { MovementType, Prisma } from '@prisma/client';

@Injectable()
export class MovementRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(
    enterpriseId: string,
    inventoryId: string,
    type: MovementType,
    data: UpdateStockDto,
  ) {
    return this.prisma.stockMovement.create({
      data: {
        ...data,
        type,
        inventoryId,
        enterpriseId,
      },
    });
  }

  findById(id: string) {
    return this.prisma.store.findUnique({
      where: { id },
    });
  }

  list(
    enterpriseId: string,
    where: Prisma.StockMovementWhereInput,
    orderBy: Prisma.StockMovementOrderByWithAggregationInput,
    page: number = 1,
    limit: number = 20,
    inventoryId: string,
  ) {
    return this.prisma.xprisma.stockMovement.paginate({
      where: {
        ...where,
        enterpriseId,
        inventoryId,
      },
      orderBy,
      page,
      limit,
    });
  }

  // update(id: string, data: UpdateStoreDto) {
  //   return this.prisma.product.update({ where: { id }, data });
  // }

  // softDelete(id: string) {
  //   return this.prisma.store.update({
  //     where: { id },
  //     data: { deletedAt: new Date() },
  //   });
  // }

  count(enterpriseId: string, filter: Prisma.StoreWhereInput) {
    return this.prisma.store.count({ where: { ...filter, enterpriseId } });
  }
}
