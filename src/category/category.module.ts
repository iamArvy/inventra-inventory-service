import { Module } from '@nestjs/common';
import { CategoryService } from './service';
import { CategoryRepository } from './repository';
import { CategoryHttpController, CategoryGrpcController } from './controller';
import { ProductRepository } from 'src/product/repository';
import { CategoryEvent } from './event';

@Module({
  controllers: [CategoryGrpcController, CategoryHttpController],
  providers: [
    CategoryService,
    CategoryRepository,
    ProductRepository,
    CategoryEvent,
  ],
})
export class CategoryModule {}
