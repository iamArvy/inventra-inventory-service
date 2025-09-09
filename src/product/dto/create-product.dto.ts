import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDefined,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { StoreId } from 'src/common/dto';

export class CreateProductDto extends StoreId {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Description of the product',
    example: 'High-quality wireless headphones with noise cancellation.',
    required: false,
  })
  description?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/images/headphones.jpg',
    required: false,
  })
  image?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'ID of the category for product',
    example: '689a59682318f6eaa0729a1d',
  })
  @IsMongoId()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) of the product',
    example: 'SKU12345',
  })
  sku: string;

  @IsNumber()
  @IsDefined()
  @ApiProperty({
    description: 'Price of the product',
    example: 999,
  })
  price: number;

  @IsNumber()
  @IsDefined()
  @ApiProperty({
    description: 'Stock quantity of the product',
    example: 100,
  })
  stock: number;

  @IsOptional()
  @IsObject()
  @ApiProperty({
    description: 'Attributes of the product',
    type: 'object',
    additionalProperties: true,
  })
  attributes?: Record<string, any>;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    description: 'Tags associated with the product',
    type: [String],
    example: ['electronics', 'headphones'],
    required: false,
  })
  tags?: string[];
}
