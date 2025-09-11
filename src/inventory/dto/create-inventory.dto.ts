import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EnterpriseInput } from 'src/common/dto';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  price: number;

  @IsString()
  @ApiProperty({
    description: 'Address of the store',
    example: 'No 1, A Street, B City, C State, D Country.',
    required: true,
  })
  @IsNotEmpty()
  quantity: number;
}

export class CreateInventoryInput extends EnterpriseInput {
  data: CreateInventoryDto;
  productId: string;
}
