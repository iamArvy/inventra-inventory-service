import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsOptional, IsString } from 'class-validator';
import { IdInput } from 'src/common/dto';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Name of the product',
    example: 'Update Category',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Description of the category',
    example: 'Updated Description of the category',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Image of the category',
    example: 'https://iamgurl/example.png',
  })
  image?: string;
}

export class GrpcUpdateCategoryDto extends IdInput {
  @ApiProperty({
    description: 'Updated Data',
    type: UpdateCategoryDto,
  })
  @IsDefined()
  data: UpdateCategoryDto;
}
