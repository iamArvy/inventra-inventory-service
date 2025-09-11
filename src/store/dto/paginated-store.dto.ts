import { PaginatedDto } from 'src/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { StoreEntity } from '../entity';

export class PaginatedStoreDto extends PaginatedDto<StoreEntity> {
  @ApiProperty({ type: [StoreEntity] })
  @Type(() => StoreEntity)
  declare result: StoreEntity[];

  constructor(partial: Partial<PaginatedStoreDto>) {
    super();
    Object.assign(this, partial);
  }
}
