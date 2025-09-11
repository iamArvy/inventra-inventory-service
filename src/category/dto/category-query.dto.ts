import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnterpriseInput, PaginationQueryDto } from 'src/common/dto';

export enum CategorySortBy {
  NAME = 'name',
  DATE = 'createdAt',
}

export class CategoryQueryDto extends PaginationQueryDto {
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
}

export class ListCategoryDto extends EnterpriseInput {
  query: CategoryQueryDto;
}
