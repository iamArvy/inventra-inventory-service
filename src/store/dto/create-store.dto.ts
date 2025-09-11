import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { EnterpriseInput } from 'src/common/dto';

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Address of the store',
    example: 'No 1, A Street, B City, C State, D Country.',
    required: true,
  })
  @IsNotEmpty()
  address: string;
}

export class CreateStoreInput extends EnterpriseInput {
  data: CreateStoreDto;
}
