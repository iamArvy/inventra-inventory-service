import { PaginatedDto } from 'src/common/dto';
import { CategoryDto } from './category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Type } from 'class-transformer';

export class PaginatedCategoryDto extends PaginatedDto<CategoryDto> {
  @ApiProperty({ type: [CategoryDto] })
  @Type(() => CategoryDto)
  declare docs: CategoryDto[];

  static from(data): PaginatedCategoryDto {
    return plainToInstance(PaginatedCategoryDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
