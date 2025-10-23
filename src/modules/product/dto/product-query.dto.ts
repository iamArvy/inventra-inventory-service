import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto';

export enum ProductSortBy {
  NAME = 'name',
  SKU = 'sku',
  DATE = 'createdAt',
}

export class ProductQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ProductSortBy,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy;

  @ApiPropertyOptional({ description: 'SKU of the product' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Name of the supplier' })
  @IsOptional()
  @IsString()
  name?: string;
}
