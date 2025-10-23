import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateInventoryDto,
  InventoryQueryDto,
  PatchInventoryDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionType } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventKeys } from 'src/common/event-keys';
import { LowStockEvent } from 'src/events/low-stock.event';
import { InventoryCreatedEvent } from 'src/events';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  private logger = new Logger(InventoryService.name);

  async create(warehouseId: string, data: CreateInventoryDto) {
    const { productId } = data;

    const warehouse = await this.prisma.instance.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) throw new BadRequestException('Invalid Warehouse');

    const product = await this.prisma.instance.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new BadRequestException('Invalid Product');

    const existing = await this.prisma.instance.warehouseInventory.findUnique({
      where: { warehouseId_productId: { warehouseId, productId } },
    });

    if (existing) throw new BadRequestException('Invalid Inventory');

    const inventory = await this.prisma.instance.warehouseInventory.create({
      // @ts-expect-error error from prisma instance
      data: { warehouseId, ...data },
      include: { product: true },
    });

    this.eventEmitter.emit(
      EventKeys.INVENTORY_CREATED,
      new InventoryCreatedEvent(
        inventory.id,
        warehouseId,
        productId,
        inventory.stock,
      ),
    );

    this.logger.log(
      `Inventory created for product ${productId} in warehouse ${warehouseId}`,
    );
    return inventory;
  }

  async get(warehouseId: string, productId: string) {
    const inventory = await this.prisma.instance.warehouseInventory.findUnique({
      where: { warehouseId_productId: { warehouseId, productId } },
      include: { product: true },
    });
    if (!inventory) throw new NotFoundException('Inventory not found');
    return inventory;
  }

  async list(warehouseId: string, query: InventoryQueryDto) {
    const { sortBy, order, page, limit } = query;
    const orderBy = { [sortBy ?? 'createdAt']: order };

    const result =
      await this.prisma.instance.xprisma.warehouseInventory.paginate({
        where: {
          warehouseId,
        },
        include: { product: true },
        orderBy,
        page: page ?? 1,
        limit: limit ?? 20,
      });

    return result;
  }

  async update(
    warehouseId: string,
    productId: string,
    data: PatchInventoryDto,
  ) {
    const inventory = await this.prisma.instance.warehouseInventory.findUnique({
      where: { warehouseId_productId: { warehouseId, productId } },
    });
    if (!inventory) throw new NotFoundException('Inventory not found');

    const updated = await this.prisma.warehouseInventory.update({
      where: { id: inventory.id },
      include: { product: true },
      data,
    });

    if (data.minStock && data.minStock > inventory.stock)
      this.eventEmitter.emit(
        EventKeys.LOW_STOCK,
        new LowStockEvent(
          warehouseId,
          productId,
          updated.stock,
          updated.capacity,
        ),
      );

    this.logger.log(
      `Update inventory for product ${productId} in ${warehouseId}`,
    );

    return updated;
  }

  async updateStock(
    warehouseId: string,
    productId: string,
    type: TransactionType,
    quantity: number,
  ) {
    const inventory = await this.prisma.instance.warehouseInventory.findUnique({
      where: { warehouseId_productId: { warehouseId, productId } },
    });
    if (!inventory) throw new NotFoundException('Inventory not found');

    let stock = inventory.stock;

    if (type === TransactionType.inbound) {
      stock = stock + quantity;
      if (stock > inventory.capacity)
        throw new BadRequestException('Not enough capacity');
    }

    if (type === TransactionType.outbound) {
      if (quantity > stock)
        throw new BadRequestException('Not enough items in stock');
      stock = stock - quantity;
    }
    const updated = await this.prisma.warehouseInventory.update({
      where: { id: inventory.id },
      data: {
        stock,
      },
    });

    if (stock < inventory.minStock)
      this.eventEmitter.emit(
        EventKeys.LOW_STOCK,
        new LowStockEvent(
          warehouseId,
          productId,
          updated.stock,
          updated.capacity,
        ),
      );

    this.logger.log(
      `Stock updated for product ${productId} in warehouse ${warehouseId}`,
    );
  }
}
