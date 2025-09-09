import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from 'src/common/dto';

export enum ProductSortBy {
  NAME = 'name',
  PRICE = 'price',
  STOCK = 'stock',
  SKU = 'sku',
  DATE = 'createdAt',
}

export class ProductQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ProductSortBy, description: 'Field to sort by' })
  @IsOptional()
  @IsEnum(ProductSortBy)
  sortBy?: ProductSortBy;

  @ApiPropertyOptional({ description: 'Name of the product' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'SKU of the product' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'ID of the store' })
  @IsOptional()
  @IsString()
  @IsUUID()
  storeId?: string;

  @ApiPropertyOptional({ type: String, description: 'ID of the category' })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Minimum price of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999998)
  @Type(() => Number)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price of the product' })
  @IsOptional()
  @IsNumber()
  @Max(9999999999)
  @Min(1)
  @Type(() => Number)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Minimum stock of the product' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minStock?: number;

  @ApiPropertyOptional({ description: 'Maximum stock of the product' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxStock?: number;

  @ApiPropertyOptional({
    type: [String],
    description: 'Tags associated with the product',
  })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Filter deleted products',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  deleted?: boolean;
}
