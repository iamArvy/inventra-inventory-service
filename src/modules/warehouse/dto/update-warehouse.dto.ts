import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { WarehouseStatus } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UpdateWarehouseDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  location: string;

  @IsEnum(WarehouseStatus, {
    message: 'Status must be either active or inactive',
  })
  @ApiProperty({
    description: 'Status of the warehouse',
    enum: WarehouseStatus,
    example: WarehouseStatus.active,
  })
  status: WarehouseStatus;
}

export class PatchWarehouseDto extends PartialType(UpdateWarehouseDto) {}
