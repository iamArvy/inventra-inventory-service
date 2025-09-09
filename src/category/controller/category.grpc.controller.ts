import { Controller } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CategoryQueryDto,
  CategoryDto,
  PaginatedCategoryDto,
  GrpcUpdateCategoryDto,
  CreateCategoryDto,
} from '../dto';
import { IdInput } from 'common/dto';
import { runRpcMethod } from 'src/common/helpers/run-rpc-method';
import { Status } from 'src/common/dto/app.response';

@Controller('categories')
export class CategoryGrpcController {
  constructor(private readonly service: CategoryService) {}

  @GrpcMethod('CategoryService')
  create(data: CreateCategoryDto) {
    return runRpcMethod<CategoryDto>(this.service.create(data));
  }

  @GrpcMethod('CategoryService')
  get({ id }: IdInput) {
    return runRpcMethod<CategoryDto>(this.service.get(id));
  }

  @GrpcMethod('CategoryService')
  async list(query: CategoryQueryDto) {
    return runRpcMethod<PaginatedCategoryDto>(this.service.list(query));
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
