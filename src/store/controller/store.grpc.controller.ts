import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateStoreInput,
  PaginatedStoreDto,
  ListStoreDto,
  GrpcUpdateStoreDto,
} from '../dto';
import { IdInput } from 'src/common/dto';
import { runRpcMethod } from 'src/common/helpers/run-rpc-method';
import { Status } from 'src/common/dto/app.response';
import { StoreEntity } from '../entity';
import { StoreService } from '../service';

@Controller('stores')
export class StoreGrpcController {
  constructor(private readonly service: StoreService) {}

  @GrpcMethod('CategoryService')
  create({ enterpriseId, data }: CreateStoreInput) {
    return runRpcMethod<StoreEntity>(this.service.create(enterpriseId, data));
  }

  @GrpcMethod('CategoryService')
  get({ id }: IdInput) {
    return runRpcMethod<StoreEntity>(this.service.get(id));
  }

  @GrpcMethod('CategoryService')
  async list({ enterpriseId, query }: ListStoreDto) {
    return runRpcMethod<PaginatedStoreDto>(
      this.service.list(enterpriseId, query),
    );
  }

  @GrpcMethod('CategoryService')
  update({ id, data }: GrpcUpdateStoreDto) {
    return runRpcMethod<Status>(this.service.update(id, data));
  }

  @GrpcMethod('CategoryService')
  delete({ id }: IdInput) {
    return runRpcMethod<Status>(this.service.delete(id));
  }

  // @GrpcMethod('CategoryService')
  // async inventories({ id }: IdInput) {
  //   return runRpcMethod<PaginatedStoreDto>(this.service.inventories(id));
  // }
}
