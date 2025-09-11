import { ApiProperty } from '@nestjs/swagger';
import { Store } from '@prisma/client';
import { Exclude } from 'class-transformer';
export class StoreEntity {
  @ApiProperty({
    description: 'id of the category',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'name of the category',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'address of the store',
    type: String,
  })
  address: string;

  @ApiProperty({
    description: 'store id of the category',
    type: String,
  })
  enterpriseId: string;

  @ApiProperty({
    description: 'creation date of the category',
    type: String,
  })
  createdAt: Date;

  @Exclude()
  inventory?: object;

  constructor(partial: Partial<Store>) {
    Object.assign(this, partial);
  }
}
