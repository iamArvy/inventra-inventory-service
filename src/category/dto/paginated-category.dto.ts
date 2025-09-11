import { PaginatedDto } from 'src/common/dto';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '../entity';
import { Type } from 'class-transformer';

export class PaginatedCategoryDto extends PaginatedDto<CategoryEntity> {
  @ApiProperty({ type: [CategoryEntity] })
  @Type(() => CategoryEntity)
  declare results: CategoryEntity[];

  constructor(partial: Partial<PaginatedCategoryDto>) {
    super();
    Object.assign(this, partial);
  }
}
