import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { PaginatedDto } from 'src/common/dto';
import { plainToInstance, Type } from 'class-transformer';

export class PaginatedProductDto extends PaginatedDto<ProductDto> {
  @ApiProperty({ type: [ProductDto] })
  @Type(() => ProductDto)
  declare docs: ProductDto[];

  static from(data): PaginatedProductDto {
    return plainToInstance(PaginatedProductDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
