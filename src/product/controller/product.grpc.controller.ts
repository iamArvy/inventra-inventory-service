import { IdInput } from 'common/dto';
import {
  ProductDto,
  ProductQueryDto,
  PaginatedProductDto,
  CreateProductDto,
  GrpcUpdateProductDto,
} from '../dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { runRpcMethod } from 'src/common/helpers/run-rpc-method';
import { Status } from 'src/common/dto/app.response';

@Controller('products')
export class ProductGrpcController {
  constructor(private readonly service: ProductService) {}

  @GrpcMethod('ProductService')
  create(data: CreateProductDto) {
    return runRpcMethod<ProductDto>(this.service.create(data));
  }

  @GrpcMethod('ProductService')
  get({ id }: IdInput) {
    return runRpcMethod<ProductDto>(this.service.get(id));
  }

  @GrpcMethod('ProductService')
  list(query: ProductQueryDto) {
    return runRpcMethod<PaginatedProductDto>(this.service.list(query));
  }

  @GrpcMethod('ProductService')
  update({ id, data }: GrpcUpdateProductDto) {
    return runRpcMethod<Status>(this.service.update(id, data));
  }

  @GrpcMethod('ProductService')
  delete({ id }: IdInput) {
    return runRpcMethod<Status>(this.service.delete(id));
  }
}
