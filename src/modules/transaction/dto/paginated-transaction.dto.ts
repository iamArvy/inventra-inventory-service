import { ApiProperty } from '@nestjs/swagger';
import { PaginatedDto } from 'src/common/dto';
import { plainToInstance, Type } from 'class-transformer';
import { TransactionDto } from './transaction.dto';

export class PaginatedTransactionDto extends PaginatedDto<TransactionDto> {
  @ApiProperty({ type: [TransactionDto] })
  @Type(() => TransactionDto)
  declare result: TransactionDto[];

  constructor(partial: Partial<PaginatedTransactionDto>) {
    super();
    Object.assign(this, partial);
  }

  static from(raw): PaginatedTransactionDto {
    return plainToInstance(PaginatedTransactionDto, raw, {
      excludeExtraneousValues: true,
    });
  }
}
