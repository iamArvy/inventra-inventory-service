import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class Status {
  @ApiProperty({
    description: 'Status of operation',
    type: Boolean,
  })
  @IsBoolean()
  success: boolean;

  constructor(success: boolean) {
    this.success = success;
  }
}
