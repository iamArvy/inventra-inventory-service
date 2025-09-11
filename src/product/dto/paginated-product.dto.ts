import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto';
import { plainToInstance, Type } from 'class-transformer';
import { ProductEntity } from '../entity';

export class PaginatedProductDto extends PaginatedDto<ProductEntity> {
  @ApiProperty({ type: [ProductEntity] })
  @Type(() => ProductEntity)
  declare result: ProductEntity[];

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
