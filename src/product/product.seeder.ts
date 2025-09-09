import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Category } from 'src/category/schema';

@Injectable()
export class ProductsSeeder implements Seeder {
  constructor(
    @InjectModel(Product.name) private readonly product: Model<Product>,
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async seed(): Promise<any> {
    const categories = await this.categoryModel.find();
    // Generate 10 users.
    const products = DataFactory.createForClass(Product).generate(10);
    const productWithRelationship = products.map((product) => {
      // Pick a random category
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];

      return {
        ...product,
        category: randomCategory._id, // use the category's _id
        storeId: randomCategory.storeId, // use the category's store_id
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    return this.product.insertMany(productWithRelationship, { lean: true });
  }

  async drop(): Promise<any> {
    return this.product.deleteMany({});
  }
}
