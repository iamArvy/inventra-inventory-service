import { Module } from '@nestjs/common';
import { InventoryController } from './controller';
import { InventoryService } from './service';
import { InventoryListener } from './listener';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, InventoryListener],
})
export class InventoryModule {}
