import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateInventoryDto {
  @IsInt()
  @ApiProperty()
  minStock: number;

  @IsInt()
  @ApiProperty()
  capacity: number;
}

export class PatchInventoryDto extends PartialType(UpdateInventoryDto) {}
