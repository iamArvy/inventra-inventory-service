import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Category } from './schema/category.schema';

@Injectable()
export class CategoriesSeeder implements Seeder {
  constructor(
    @InjectModel(Category.name) private readonly model: Model<Category>,
  ) {}

  async seed(amount: number = 10): Promise<any> {
    const categories = DataFactory.createForClass(Category).generate(amount);
    return this.model.insertMany(categories, { lean: true });
  }

  async drop(): Promise<any> {
    return this.model.deleteMany({});
  }
}
