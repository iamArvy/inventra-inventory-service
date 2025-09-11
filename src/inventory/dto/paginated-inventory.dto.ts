import { PaginatedDto } from 'src/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { InventoryEntity } from '../entity';
import { Inventory } from '@prisma/client';
import { PaginationResult } from 'prisma-paginate';

export class PaginatedInventoryDto extends PaginatedDto<InventoryEntity> {
  @ApiProperty({ type: [InventoryEntity] })
  @Type(() => InventoryEntity)
  declare results: InventoryEntity[];

  constructor(partial: PaginationResult<Inventory[]>) {
    super();
    Object.assign(this, partial);
  }
}
