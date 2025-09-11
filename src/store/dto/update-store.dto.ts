import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';
import { CreateCategoryDto } from 'src/category';
import { IdInput } from 'src/common/dto';

export class UpdateStoreDto extends PartialType(CreateCategoryDto) {}
export class GrpcUpdateStoreDto extends IdInput {
  @ApiProperty({
    description: 'Updated Data',
    type: UpdateStoreDto,
  })
  @IsDefined()
  data: UpdateStoreDto;
}
