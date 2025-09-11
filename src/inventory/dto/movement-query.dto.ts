import { ApiPropertyOptional } from '@nestjs/swagger';
import { MovementType } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnterpriseInput, PaginationQueryDto } from 'src/common/dto';

export enum MovementSortBy {
  QUANTITY = 'quantity',
  DATE = 'createdAt',
}

export class MovementQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: MovementSortBy,
    description: 'Field to sort by',
  })
  @IsOptional()
  @IsEnum(MovementSortBy)
  sortBy?: MovementSortBy;

  @ApiPropertyOptional({ description: 'Name of the category' })
  @IsOptional()
  @IsString()
  type?: MovementType;
}

export class ListMovementDto extends EnterpriseInput {
  query: MovementQueryDto;
}

export class GrpcListMovementDto extends ListMovementDto {
  id: string;
}
