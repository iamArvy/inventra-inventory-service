import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProductDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiProperty()
  sku: string;

  @Expose()
  @ApiProperty()
  supplierId: string | null;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;

  @Expose()
  @ApiProperty()
  deletedAt: string | null;
}
