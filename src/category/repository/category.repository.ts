import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Category,
  CategoryDocument,
} from 'src/category/schema/category.schema';
import { PaginateModel } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MongoRepository } from 'src/common/repositories/mongo.repository';

@Injectable()
export class CategoryRepository extends MongoRepository<
  CategoryDocument,
  Category
> {
  constructor(
    @InjectModel(Category.name) model: PaginateModel<CategoryDocument>,
  ) {
    super(model);
  }

  findByName(store_id: string, name: string) {
    return this.model
      .findOne({
        store_id,
        name,
      })
      .exec();
  }

  findByNameOrThrow(store_id: string, name: string) {
    return this.model
      .findOne({
        store_id,
        name,
      })
      .orFail(new NotFoundException('Category not found'))
      .exec();
  }
}
