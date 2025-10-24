import { Module } from '@nestjs/common';
import { WarehouseController } from './controller';
import { WarehouseService } from './service';

@Module({
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
