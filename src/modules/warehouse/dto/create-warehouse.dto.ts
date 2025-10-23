import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  location: string;
}
