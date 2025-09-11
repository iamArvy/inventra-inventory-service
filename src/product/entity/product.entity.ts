import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
// import { Product } from '@prisma/client';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { CategoryEntity } from 'src/category';

class InventoryEntity {
  @ApiProperty()
  stock: number;

  @ApiProperty()
  price: number;

  constructor(partial: Partial<InventoryEntity>) {
    Object.assign(this, partial);
  }
}

export class ProductEntity {
  @ApiProperty({
    description: 'Unique identifier of the product',
    example: 'product_123',
  })
  id: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Wireless Headphones',
  })
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'High-quality wireless headphones with noise cancellation.',
  })
  description: string;

  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/images/headphones.jpg',
  })
  image: string | null;

  @ApiProperty({
    description: 'ID of the store where the product is available',
    example: 'store_123',
  })
  enterpriseId: string;

  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) of the product',
    example: 'SKU12345',
  })
  sku: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 999,
  })
  @Transform(({ value }) => Number(value)) // Decimal -> number
  basePrice: number;

  @ApiProperty({ type: [InventoryEntity] })
  @Type(() => InventoryEntity)
  @Exclude()
  inventories: InventoryEntity[];

  @ApiProperty({
    description: 'Stock quantity of the product (calculated)',
    example: 100,
  })
  get stock(): number {
    return (
      this.inventories?.reduce((sum, inv) => sum + (inv.stock || 0), 0) ?? 0
    );
  }

  @ApiProperty({
    description: 'Price of the product',
    example: 999,
  })
  @Expose()
  get price(): number {
    if (this.inventories.length > 1) return this.basePrice;
    return this.inventories[0].price
      ? this.inventories[0].price
      : this.basePrice;
  }

  @ApiProperty({
    description: 'Attributes of the product',
    type: 'object',
    additionalProperties: true,
    example: { color: 'black', size: 'medium' },
  })
  attributes: Record<string, any>;

  @ApiProperty({
    description: 'Tags associated with the product',
    type: [String],
    example: ['electronics', 'headphones'],
  })
  tags: string[];

  @ApiProperty({
    description: 'Category details of the product',
    type: CategoryEntity,
    required: false,
  })
  category: Partial<CategoryEntity>;

  @ApiProperty({
    description: 'Date when the product was created',
    type: Date,
    example: '2023-10-01T12:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the product was deleted',
    type: Date,
    required: false,
  })
  deletedAt?: Date;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);
  }
}
