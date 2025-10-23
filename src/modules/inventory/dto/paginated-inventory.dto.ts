import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto';
import { plainToInstance, Type } from 'class-transformer';
import { InventoryDto } from './inventory.dto';

export class PaginatedInventoryDto extends PaginatedDto<InventoryDto> {
  @ApiProperty({ type: [InventoryDto] })
  @Type(() => InventoryDto)
  declare result: InventoryDto[];

  constructor(partial: Partial<PaginatedInventoryDto>) {
    super();
    Object.assign(this, partial);
  }

  static from(raw): PaginatedInventoryDto {
    return plainToInstance(PaginatedInventoryDto, raw, {
      excludeExtraneousValues: true,
    });
  }
}
