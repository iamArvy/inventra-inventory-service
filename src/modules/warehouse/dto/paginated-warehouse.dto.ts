import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto';
import { plainToInstance, Type } from 'class-transformer';
import { WarehouseDto } from './warehouse.dto';

export class PaginatedWarehouseDto extends PaginatedDto<WarehouseDto> {
  @ApiProperty({ type: [WarehouseDto] })
  @Type(() => WarehouseDto)
  declare result: WarehouseDto[];

  constructor(partial: Partial<PaginatedWarehouseDto>) {
    super();
    Object.assign(this, partial);
  }

  static from(raw): PaginatedWarehouseDto {
    return plainToInstance(PaginatedWarehouseDto, raw, {
      excludeExtraneousValues: true,
    });
  }
}
