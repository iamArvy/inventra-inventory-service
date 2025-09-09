import { Injectable } from '@nestjs/common';
import { ProductEvents } from './product.keys';
import { ProductDto } from 'src/product/dto';
import { RMQService } from 'src/rmq';

@Injectable()
export class ProductEvent {
  constructor(private readonly rmq: RMQService) {}
  created(data: ProductDto) {
    this.rmq.emit(ProductEvents.PRODUCT_CREATED, data);
  }

  updated(id: string, data: Partial<ProductDto>) {
    this.rmq.emit(ProductEvents.PRODUCT_UPDATED, { id, data });
  }

  deleted(id: string) {
    this.rmq.emit(ProductEvents.PRODUCT_DELETED, { id });
  }
}
