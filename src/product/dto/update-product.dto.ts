import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { IdInput } from 'src/common/dto';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  name?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Description of the product',
    example: 'High-quality wireless headphones with noise cancellation.',
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Image URL of the product',
    example: 'https://example.com/images/headphones.jpg',
  })
  image?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'ID of the category for product',
    example: '689a59682318f6eaa0729a1d',
  })
  @IsMongoId()
  categoryId?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'SKU (Stock Keeping Unit) of the product',
    example: 'SKU12345',
  })
  sku?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Price of the product',
    example: 999,
  })
  price?: number;

  @IsOptional()
  @IsObject()
  @ApiPropertyOptional({
    description: 'Attributes of the product',
    type: 'object',
    additionalProperties: true,
  })
  attributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({
    description: 'Tags associated with the product',
    type: [String],
    example: ['electronics', 'headphones'],
  })
  tags?: string[];
}

export class GrpcUpdateProductDto extends IdInput {
  @ApiProperty({
    description: 'Updated Data',
    type: UpdateProductDto,
  })
  @IsDefined()
  data: UpdateProductDto;
}
