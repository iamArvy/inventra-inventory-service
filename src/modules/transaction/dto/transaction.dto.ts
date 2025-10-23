import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Expose } from 'class-transformer';
import { ProductDto } from 'src/modules/product/dto';
import { WarehouseDto } from 'src/modules/warehouse/dto';

export class TransactionDto {
  @Expose()
  @ApiProperty()
  id: string;

  warehouseId: string;

  @Expose()
  @ApiProperty({ type: WarehouseDto })
  warehouse: WarehouseDto;

  productId: string;

  @Expose()
  @ApiProperty({ type: ProductDto })
  product: ProductDto;

  @Expose()
  @ApiProperty()
  quantity: number;

  @Expose()
  @ApiProperty({
    enum: TransactionType,
    description: 'The type of transaction being made',
    example: TransactionType.inbound,
  })
  type: TransactionType;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
