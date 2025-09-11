import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { IdInput } from './id.dto';

export class EnterpriseId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'ID of the store',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  enterpriseId: string;
}

export class EnterpriseIdInput<T> extends IdInput {
  enterpriseId: EnterpriseId['enterpriseId'];
  data: T;
}

export class EnterpriseInput {
  @ApiPropertyOptional({ description: 'ID of the store' })
  @IsOptional()
  @IsString()
  @IsUUID()
  enterpriseId: string;
  storeId: string;
}
