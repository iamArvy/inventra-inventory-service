import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EnterpriseInput } from 'src/common/dto';

export class UpdateStockDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  quantity: number;

  @IsString()
  @ApiProperty({
    description: 'Address of the store',
    example: 'No 1, A Street, B City, C State, D Country.',
    required: true,
  })
  @IsNotEmpty()
  reason: string;
}

export class UpdateStockInput extends EnterpriseInput {
  data: UpdateStockDto;
}

export class GrpcUpdateStockInput extends UpdateStockInput {
  id: string;
}
