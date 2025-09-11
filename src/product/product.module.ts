import { Module } from '@nestjs/common';
import { ProductService } from './service';
import { ProductRepository } from './repository';
import { CategoryRepository } from 'src/category/repository';
import { ProductGrpcController, ProductHttpController } from './controller';
import { ProductEvent } from './event';

@Module({
  imports: [],
  controllers: [ProductGrpcController, ProductHttpController],
  providers: [
    ProductService,
    ProductRepository,
    CategoryRepository,
    ProductEvent,
  ],
})
export class ProductModule {}
