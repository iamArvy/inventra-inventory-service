import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dto';

export enum CategorySortBy {
  NAME = 'name',
  DATE = 'createdAt',
}

export class CategoryQueryDto extends PaginationDto {
  @ApiPropertyOptional({
    enum: CategorySortBy,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(CategorySortBy)
  sortBy?: CategorySortBy;

  @ApiPropertyOptional({ description: 'Name of the category' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'ID of the store' })
  @IsOptional()
  @IsString()
  @IsUUID()
  storeId?: string;
}
