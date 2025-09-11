import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateInventoryInput,
  PaginatedInventoryDto,
  ListInventoryDto,
  GrpcUpdateInventoryDto,
  GrpcUpdateStockInput,
  GrpcListMovementDto,
} from '../dto';
import { IdInput } from 'src/common/dto';
import { runRpcMethod } from 'src/common/helpers/run-rpc-method';
import { Status } from 'src/common/dto/app.response';
import { InventoryEntity } from '../entity';
import { InventoryService } from '../service';
import { MovementType } from '@prisma/client';

@Controller('inventories')
export class InventoryGrpcController {
  constructor(private readonly service: InventoryService) {}

  @GrpcMethod('InventoryService')
  create({ enterpriseId, productId, storeId, data }: CreateInventoryInput) {
    return runRpcMethod<InventoryEntity>(
      this.service.create(enterpriseId, productId, storeId, data),
    );
  }

  @GrpcMethod('InventoryService')
  get({ id }: IdInput) {
    return runRpcMethod<InventoryEntity>(this.service.get(id));
  }

  @GrpcMethod('InventoryService')
  async list({ enterpriseId, query }: ListInventoryDto) {
    return runRpcMethod<PaginatedInventoryDto>(
      this.service.list(enterpriseId, query),
    );
  }

  @GrpcMethod('InventoryService')
  update({ id, data }: GrpcUpdateInventoryDto) {
    return runRpcMethod<Status>(this.service.update(id, data));
  }

  @GrpcMethod('InventoryService')
  delete({ id }: IdInput) {
    return runRpcMethod<Status>(this.service.delete(id));
  }

  @GrpcMethod('InventoryService')
  increaseStock({ enterpriseId, id, data }: GrpcUpdateStockInput) {
    return this.service.updateStock(
      enterpriseId,
      id,
      MovementType.INCREASE,
      data,
    );
  }

  @GrpcMethod('InventoryService')
  decreaseStock({ enterpriseId, id, data }: GrpcUpdateStockInput) {
    return this.service.updateStock(
      enterpriseId,
      id,
      MovementType.DECREASE,
      data,
    );
  }

  @GrpcMethod('InventoryService')
  listMovements({ enterpriseId, id, query }: GrpcListMovementDto) {
    return this.service.listMovement(enterpriseId, id, query);
  }

  @GrpcMethod('InventoryService')
  getMovement({ id }: IdInput) {
    return this.service.getMovement(id);
  }
}
