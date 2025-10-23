import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ProductDto } from './product.dto';

export class PaginatedProductDto extends PaginatedDto<ProductDto> {
  @ApiProperty({ type: [ProductDto] })
  @Type(() => ProductDto)
  declare result: ProductDto[];

  constructor(partial: Partial<PaginatedProductDto>) {
    super();
    Object.assign(this, partial);
  }

  static from(raw): PaginatedProductDto {
    return plainToInstance(PaginatedProductDto, raw, {
      excludeExtraneousValues: true,
    });
  }
}
