import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProductDto } from 'src/modules/product/dto';

export class InventoryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  warehouseId: string;

  @Expose()
  @ApiProperty()
  productId: string;

  @Expose()
  @ApiProperty({ type: ProductDto })
  product: ProductDto;

  @Expose()
  @ApiProperty()
  stock: number;

  @Expose()
  @ApiProperty()
  minStock: number;

  @Expose()
  @ApiProperty()
  capacity: number;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}
