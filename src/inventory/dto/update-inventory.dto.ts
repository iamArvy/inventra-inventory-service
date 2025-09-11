import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { IdInput } from 'src/common/dto';

export class UpdateInventoryDto {
  price: string;
}
export class GrpcUpdateInventoryDto extends IdInput {
  @ApiProperty({
    description: 'Updated Data',
    type: UpdateInventoryDto,
  })
  @IsDefined()
  data: UpdateInventoryDto;
}
