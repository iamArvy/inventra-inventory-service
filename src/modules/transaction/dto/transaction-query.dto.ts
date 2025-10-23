import { ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto';

export enum TransactionSortBy {
  QUANTITY = 'quantity',
  DATE = 'createdAt',
}

export class TransactionQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: TransactionSortBy,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(TransactionSortBy)
  sortBy?: TransactionSortBy;

  @ApiPropertyOptional({ description: 'id of the warehouse' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiPropertyOptional({ description: 'id of the product' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsEnum(TransactionType, {
    message: 'Transaction type must be either active or inactive',
  })
  @ApiPropertyOptional({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.inbound,
  })
  type: TransactionType;
}
