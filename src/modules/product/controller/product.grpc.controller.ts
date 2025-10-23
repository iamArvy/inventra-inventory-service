// import { IdInput } from 'src/common/dto';
// import {
//   PaginatedProductDto,
//   GrpcUpdateProductDto,
//   CreateProductInput,
//   ListProductDto,
// } from '../dto';
// import { GrpcMethod } from '@nestjs/microservices';
// import { Controller } from '@nestjs/common';
// import { ProductService } from '../service/product.service';
// import { runRpcMethod } from 'src/common/helpers/run-rpc-method';
// import { Status } from 'src/common/dto/app.response';
// import { ProductEntity } from '../entity';

// @Controller('products')
// export class ProductGrpcController {
//   constructor(private readonly service: ProductService) {}

//   @GrpcMethod('ProductService')
//   create({ enterpriseId, data }: CreateProductInput) {
//     return runRpcMethod<ProductEntity>(this.service.create(enterpriseId, data));
//   }

//   @GrpcMethod('ProductService')
//   get({ id }: IdInput) {
//     return runRpcMethod<ProductEntity>(this.service.get(id));
//   }

//   @GrpcMethod('ProductService')
//   list({ enterpriseId, query }: ListProductDto) {
//     return runRpcMethod<PaginatedProductDto>(
//       this.service.list(enterpriseId, query),
//     );
//   }

//   @GrpcMethod('ProductService')
//   update({ id, data }: GrpcUpdateProductDto) {
//     return runRpcMethod<Status>(this.service.update(id, data));
//   }

//   @GrpcMethod('ProductService')
//   delete({ id }: IdInput) {
//     return runRpcMethod<Status>(this.service.delete(id));
//   }
// }
