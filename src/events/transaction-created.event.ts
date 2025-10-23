import { TransactionType } from '@prisma/client';

export class TransactionCreatedEvent {
  constructor(
    public readonly transactionId: string,
    public readonly warehouseId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly type: TransactionType,
  ) {}
}
