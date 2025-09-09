import { Module } from '@nestjs/common';
import { CategoryService } from './service';
import { CategoryRepository } from './repository';
import { Category, CategorySchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryHttpController, CategoryGrpcController } from './controller';
import { Product, ProductSchema } from 'src/product/schema';
import { ProductRepository } from 'src/product/repository';
import { CategoryEvent } from './event';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [CategoryGrpcController, CategoryHttpController],
  providers: [
    CategoryService,
    CategoryRepository,
    ProductRepository,
    CategoryEvent,
  ],
})
export class CategoryModule {}
