import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StoreId } from 'src/common/dto';

export class CreateCategoryDto extends StoreId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the category',
    example: 'Electronics',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Description of the category',
    example: 'All electronic items including phones, laptops, and accessories.',
    required: true,
  })
  @IsOptional()
  description?: string;

  @IsString()
  @ApiProperty({
    description: 'Image URL for the category',
    example: 'https://example.com/images/electronics.jpg',
    required: false,
  })
  @IsOptional()
  image?: string;
}
