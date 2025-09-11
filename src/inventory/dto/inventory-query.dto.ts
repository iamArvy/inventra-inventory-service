import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnterpriseInput, PaginationQueryDto } from 'src/common/dto';

export enum InventorySortBy {
  PRICE = 'price',
  QUANTITY = 'quantity',
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

  @ApiPropertyOptional({ description: 'Name of the category' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiPropertyOptional({ description: 'Name of the category' })
  @IsOptional()
  @IsString()
  storeId?: string;
}

export class ListInventoryDto extends EnterpriseInput {
  query: InventoryQueryDto;
}
