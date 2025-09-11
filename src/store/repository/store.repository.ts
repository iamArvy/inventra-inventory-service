import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateStoreDto, UpdateStoreDto } from '../dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoreRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(enterpriseId: string, data: CreateStoreDto) {
    return this.prisma.store.create({
      data: {
        ...data,
        enterpriseId,
      },
    });
  }

  findById(id: string) {
    return this.prisma.store.findUnique({
      where: { id },
    });
  }

  findByName(enterpriseId: string, name: string) {
    return this.prisma.store.findUnique({
      where: { name_enterpriseId: { name, enterpriseId } },
    });
  }

  list(
    enterpriseId: string,
    where: Prisma.StoreWhereInput,
    orderBy: Prisma.StoreOrderByWithAggregationInput,
    page: number = 1,
    limit: number = 5,
  ) {
    return this.prisma.xprisma.store.paginate({
      where: { ...where, enterpriseId },
      orderBy,
      page,
      limit,
    });
  }

  update(id: string, data: UpdateStoreDto) {
    return this.prisma.product.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.prisma.store.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  count(enterpriseId: string, filter: Prisma.StoreWhereInput) {
    return this.prisma.store.count({ where: { ...filter, enterpriseId } });
  }

  inventories(storeId: string) {
    return this.prisma.xprisma.inventory.paginate({
      where: { storeId },
      page: 1,
      limit: 20,
    });
  }
}
