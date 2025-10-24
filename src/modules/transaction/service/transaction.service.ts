import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto, TransactionQueryDto } from '../dto';
import { PrismaService } from 'src/prisma';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventKeys } from 'src/common/event-keys';
import { TransactionCreatedEvent } from 'src/events';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  private readonly logger = new Logger(TransactionService.name);

  async create(data: CreateTransactionDto) {
    const { warehouseId, productId } = data;
    const warehouse = await this.prisma.instance.warehouse.findUnique({
      where: { id: warehouseId },
    });
    if (!warehouse) throw new BadRequestException('Warehouse does not exist');

    const product = await this.prisma.instance.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new BadRequestException('Product not found');

    const inventory = await this.prisma.instance.warehouseInventory.findUnique({
      where: { warehouseId_productId: { warehouseId, productId } },
    });

    if (!inventory)
      throw new BadRequestException(
        'Inventory not found for product in warehouse',
      );

    if (data.quantity > inventory.stock)
      throw new BadRequestException('Not enough items in stock');

    const transaction = await this.prisma.instance.stockTransaction.create({
      // @ts-expect-error error from prisma instance
      data,
    });
    this.logger.log(
      `Created ${transaction.type} transaction for product ${productId} in warehouse ${warehouseId} `,
    );
    this.eventEmitter.emit(
      EventKeys.TRANSACTION_CREATED,
      new TransactionCreatedEvent(
        transaction.id,
        warehouseId,
        productId,
        transaction.quantity,
        transaction.type,
      ),
    );
    return transaction;
  }

  async get(id: string) {
    const transaction = await this.prisma.instance.stockTransaction.findUnique({
      where: { id },
    });
    if (!transaction) throw new NotFoundException('Transaction not found');
    return transaction;
  }

  async list(query: TransactionQueryDto) {
    const { sortBy, order, page, limit, warehouseId, productId, type } = query;
    const orderBy = { [sortBy ?? 'createdAt']: order };

    const result = await this.prisma.instance.xprisma.stockTransaction.paginate(
      {
        where: {
          warehouseId,
          productId,
          type,
        },
        orderBy,
        page: page ?? 1,
        limit: limit ?? 20,
      },
    );

    return result;
  }
}
