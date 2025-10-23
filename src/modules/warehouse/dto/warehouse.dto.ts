import { ApiProperty } from '@nestjs/swagger';
import { WarehouseStatus } from '@prisma/client';
import { Expose } from 'class-transformer';

export class WarehouseDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  location: string;

  @Expose()
  @ApiProperty({
    description: 'Status of the warehouse',
    enum: WarehouseStatus,
    example: WarehouseStatus.active,
  })
  status: WarehouseStatus;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;

  @Expose()
  @ApiProperty()
  deletedAt: string | null;
}
