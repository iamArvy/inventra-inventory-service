import { ApiPropertyOptional } from '@nestjs/swagger';
import { WarehouseStatus } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto';

export enum WarehouseSortBy {
  NAME = 'name',
  DATE = 'createdAt',
}

export class WarehouseQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: WarehouseSortBy,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(WarehouseSortBy)
  sortBy?: WarehouseSortBy;

  @ApiPropertyOptional({ description: 'SKU of the product' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Name of the warehouse' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Status of the warehouse',
    enum: WarehouseStatus,
    example: WarehouseStatus.active,
  })
  @IsOptional()
  @IsEnum(WarehouseStatus, {
    message: 'Status must be either active or inactive',
  })
  status?: WarehouseStatus;
}
