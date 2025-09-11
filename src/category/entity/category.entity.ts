import { ApiProperty } from '@nestjs/swagger';
export class CategoryEntity {
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
    description: 'description of the category',
    type: String,
  })
  description: string | null;

  @ApiProperty({
    description: 'image of the category',
    type: String,
  })
  image: string | null;

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

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}
