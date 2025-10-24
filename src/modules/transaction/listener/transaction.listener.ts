import { TransactionType } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EventKeys } from 'src/common/event-keys';
import { TransactionService } from '../service';
import { InventoryCreatedEvent } from 'src/events';

@Injectable()
export class TransactionListener {
  constructor(private readonly service: TransactionService) {}

  @OnEvent(EventKeys.INVENTORY_CREATED)
  async handleInventoryCreated(payload: InventoryCreatedEvent) {
    const { warehouseId, productId, stock } = payload;
    await this.service.create({
      warehouseId,
      productId,
      quantity: stock,
      type: TransactionType.inbound,
    });
  }
}
