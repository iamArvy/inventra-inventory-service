import { Module } from '@nestjs/common';
import { InventoryRepository, MovementRepository } from './repository';
import { InventoryService } from './service';
import { InventoryGrpcController, InventoryHttpController } from './controller';

@Module({
  imports: [],
  controllers: [InventoryHttpController, InventoryGrpcController],
  providers: [InventoryService, InventoryRepository, MovementRepository],
})
export class StoreModule {}
