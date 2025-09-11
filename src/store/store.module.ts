import { Module } from '@nestjs/common';
import { StoreGrpcController, StoreHttpController } from './controller';
import { StoreService } from './service';
import { StoreRepository } from './repository';

@Module({
  imports: [],
  controllers: [StoreHttpController, StoreGrpcController],
  providers: [StoreService, StoreRepository],
})
export class StoreModule {}
