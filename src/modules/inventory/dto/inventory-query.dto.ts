import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto';

export enum InventorySortBy {
  STOCK = 'stock',
  DATE = 'createdAt',
}

export class InventoryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: InventorySortBy,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(InventorySortBy)
  sortBy?: InventorySortBy;
}
