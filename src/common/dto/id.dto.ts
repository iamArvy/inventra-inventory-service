import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class IdInput {
  @ApiProperty({
    description: 'ID of the resource',
  })
  @IsMongoId()
  @IsNotEmpty()
  id: string;
}

export class UpdateInput<T> extends IdInput {
  data: T;
}

// export class CreateInput<T> {
//   data: T;
// }
