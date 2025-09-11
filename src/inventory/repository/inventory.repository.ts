import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateInventoryDto, UpdateInventoryDto } from '../dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(enterpriseId: string, data: CreateInventoryDto) {
    return this.prisma.inventory.create({
      data: {
        ...data,
        enterpriseId,
      },
    });
  }

  findById(id: string) {
    return this.prisma.inventory.findUnique({
      where: { id },
    });
  }

  findByProductAndStore(productId: string, storeId: string) {
    return this.prisma.inventory.findUnique({
      where: { productId_storeId: { productId, storeId } },
    });
  }

  list(
    enterpriseId: string,
    where: Prisma.InventoryWhereInput,
    orderBy: Prisma.InventoryOrderByWithAggregationInput,
    page: number = 1,
    limit: number = 5,
  ) {
    return this.prisma.xprisma.inventory.paginate({
      where: { ...where, enterpriseId },
      orderBy,
      page,
      limit,
    });
  }

  update(id: string, data: UpdateInventoryDto) {
    return this.prisma.inventory.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.prisma.inventory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  count(enterpriseId: string, filter: Prisma.InventoryWhereInput) {
    return this.prisma.inventory.count({ where: { ...filter, enterpriseId } });
  }
}
