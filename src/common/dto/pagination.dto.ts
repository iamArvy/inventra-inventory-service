import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, Max, Min } from 'class-validator';
// import { PaginateResult } from 'mongoose';
// Allowed sort orders for number fields
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationQueryDto {
  @ApiPropertyOptional({ type: Number, minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ type: Number, minimum: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ enum: SortOrder })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder;
}

export class PaginatedDto<T> {
  @ApiProperty()
  @Expose()
  limit: number;

  @ApiProperty()
  @Expose()
  page: number;

  @ApiProperty()
  @Expose()
  count: number;

  @ApiProperty()
  @Expose()
  exceedCount: boolean;

  @ApiProperty()
  @Expose()
  exceedTotalPages: boolean;

  @ApiProperty({ type: [Object] })
  @Expose()
  result: T[];

  @ApiProperty()
  @Expose()
  hasNextPage: boolean;

  @ApiProperty()
  @Expose()
  hasPrevPage: boolean;

  @ApiProperty()
  @Expose()
  totalPages: number;
}
