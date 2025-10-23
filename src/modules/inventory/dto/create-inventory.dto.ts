import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID } from 'class-validator';

export class CreateInventoryDto {
  @IsUUID()
  @ApiProperty()
  productId: string;

  @IsInt()
  @ApiProperty()
  stock: number;

  @IsInt()
  @ApiProperty()
  minStock: number;

  @IsInt()
  @ApiProperty()
  capacity: number;
}
