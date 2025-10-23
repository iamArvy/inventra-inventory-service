import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryListener } from './inventory.listener';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, InventoryListener],
})
export class InventoryModule {}
