export class InventoryCreatedEvent {
  constructor(
    public readonly inventoryId: string,
    public readonly warehouseId: string,
    public readonly productId: string,
    public readonly stock: number,
  ) {}
}
