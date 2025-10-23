// src/events/transaction-created.event.ts
export class LowStockEvent {
  constructor(
    public readonly warehouseId: string,
    public readonly productId: string,
    public readonly stock: number,
    public readonly capacity: number,
  ) {}
}
