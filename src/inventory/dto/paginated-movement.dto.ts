import { PaginatedDto } from 'src/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MovementEntity } from '../entity';
import { StockMovement } from '@prisma/client';
import { PaginationResult } from 'prisma-paginate';

export class PaginatedMovementDto extends PaginatedDto<MovementEntity> {
  @ApiProperty({ type: [MovementEntity] })
  @Type(() => MovementEntity)
  declare results: MovementEntity[];

  constructor(partial: PaginationResult<StockMovement[]>) {
    super();
    Object.assign(this, partial);
  }
}
