import { ApiProperty } from '@nestjs/swagger';
import { Inventory } from '@prisma/client';
import { Exclude } from 'class-transformer';
export class InventoryEntity {
  @ApiProperty({
    description: 'id of the category',
    type: String,
  })
  id: string;

  @Exclude()
  enterpriseId: string;

  @ApiProperty({
    description: 'product id for the inventory',
    type: String,
  })
  productId: string;

  @ApiProperty({
    description: 'store id for the inventory',
    type: String,
  })
  storeId: string;

  @ApiProperty({
    description: 'name of the category',
    type: String,
  })
  price: number | null;

  @ApiProperty({
    description: 'quantity of the inventory',
    type: String,
  })
  quantity: number;

  @ApiProperty({
    description: 'creation date of the category',
    type: String,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'update date of the category',
    type: String,
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'deleted date of the category',
    type: String,
  })
  deletedAt?: Date;

  constructor(partial: Partial<Inventory>) {
    Object.assign(this, partial);
  }
}
