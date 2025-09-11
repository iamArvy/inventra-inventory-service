import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnterpriseInput, PaginationQueryDto } from 'src/common/dto';

export enum StoreSortBy {
  NAME = 'name',
  DATE = 'createdAt',
}

export class StoreQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: StoreSortBy,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(StoreSortBy)
  sortBy?: StoreSortBy;

  @ApiPropertyOptional({ description: 'Name of the category' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class ListStoreDto extends EnterpriseInput {
  query: StoreQueryDto;
}
