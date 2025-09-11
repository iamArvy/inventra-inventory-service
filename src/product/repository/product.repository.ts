import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateProductDto, UpdateProductDto, UpdateStockDto } from '../dto';
import { MovementType, Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(enterpriseId: string, data: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        ...data,
        enterpriseId,
      },
    });
  }

  findById(id: string, storeId?: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true },
        },
        inventories: {
          select: { quantity: true, price: true },
          where: { storeId },
        },
      },
    });
  }

  list(
    enterpriseId: string,
    where: Prisma.ProductWhereInput,
    orderBy: Prisma.ProductOrderByWithAggregationInput,
    page: number = 1,
    limit: number = 5,
    storeId?: string,
  ) {
    return this.prisma.xprisma.product.paginate({
      where: { ...where, enterpriseId },
      orderBy,
      page,
      limit,
      include: {
        category: {
          select: { name: true },
        },
        inventories: {
          select: { quantity: true },
          where: { storeId },
        },
      },
    });
  }

  update(id: string, data: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findBySku(enterpriseId: string, sku: string) {
    return this.prisma.product.findUnique({
      where: { sku_enterpriseId: { sku, enterpriseId } },
    });
  }

  count(enterpriseId: string, filter: Prisma.ProductWhereInput) {
    return this.prisma.product.count({ where: { ...filter, enterpriseId } });
  }

  inventory(productId: string, storeId: string) {
    return this.prisma.inventory.findUnique({
      where: { productId_storeId: { productId, storeId } },
    });
  }

  inventories(productId: string) {
    return this.prisma.xprisma.inventory.paginate({
      where: { productId },
      page: 1,
      limit: 20,
    });
  }

  updateStock(
    inventoryId: string,
    enterpriseId: string,
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
}
