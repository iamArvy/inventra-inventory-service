import { Module } from '@nestjs/common';
import { ProductService } from './service';
import { ProductRepository } from './repository';
import { Product, ProductSchema } from './schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryRepository } from 'src/category/repository';
import { Category, CategorySchema } from 'src/category/schema';
import { ProductGrpcController, ProductHttpController } from './controller';
import { ProductEvent } from './event';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [ProductGrpcController, ProductHttpController],
  providers: [
    ProductService,
    ProductRepository,
    CategoryRepository,
    ProductEvent,
  ],
})
export class ProductModule {}
