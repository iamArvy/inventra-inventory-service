import { Controller } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  PaginatedCategoryDto,
  GrpcUpdateCategoryDto,
  ListCategoryDto,
  CreateCategoryInput,
} from '../dto';
import { IdInput } from 'src/common/dto';
import { runRpcMethod } from 'src/common/helpers/run-rpc-method';
import { Status } from 'src/common/dto/app.response';
import { CategoryEntity } from '../entity';

@Controller('categories')
export class CategoryGrpcController {
  constructor(private readonly service: CategoryService) {}

  @GrpcMethod('CategoryService')
  create({ enterpriseId, data }: CreateCategoryInput) {
    return runRpcMethod<CategoryEntity>(
      this.service.create(enterpriseId, data),
    );
  }

  @GrpcMethod('CategoryService')
  get({ id }: IdInput) {
    return runRpcMethod<CategoryEntity>(this.service.get(id));
  }

  @GrpcMethod('CategoryService')
  async list({ enterpriseId, query }: ListCategoryDto) {
    return runRpcMethod<PaginatedCategoryDto>(
      this.service.list(enterpriseId, query),
    );
  }

  @GrpcMethod('CategoryService')
  update({ id, data }: GrpcUpdateCategoryDto) {
    return runRpcMethod<Status>(this.service.update(id, data));
  }

  @GrpcMethod('CategoryService')
  delete({ id }: IdInput) {
    return runRpcMethod<Status>(this.service.delete(id));
  }
}
