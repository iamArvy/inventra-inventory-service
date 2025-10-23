import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { IsEnum, IsInt, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @ApiProperty()
  warehouseId: string;

  @IsUUID()
  @ApiProperty()
  productId: string;

  @IsInt()
  @ApiProperty()
  quantity: number;

  @IsEnum(TransactionType, {
    message: 'Transaction type is either inbound or outbound',
  })
  @ApiProperty({
    enum: TransactionType,
    description: 'The type of transaction being made',
    example: TransactionType.inbound,
  })
  type: TransactionType;
}
