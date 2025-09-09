import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from '../schema';
import { PaginateModel } from 'mongoose';
import { MongoRepository } from 'src/common/repositories/mongo.repository';

@Injectable()
export class ProductRepository extends MongoRepository<
  ProductDocument,
  Product
> {
  constructor(
    @InjectModel(Product.name) model: PaginateModel<ProductDocument>,
  ) {
    super(model);
  }

  findByStoreIdAndSku(storeId: string, sku: string) {
    return this.model
      .findOne({
        storeId,
        sku,
      })
      .exec();
  }
}
