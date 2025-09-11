import { ApiProperty } from '@nestjs/swagger';
import { MovementType, StockMovement } from '@prisma/client';
import { Exclude } from 'class-transformer';
export class MovementEntity {
  @ApiProperty({
    description: 'id of the category',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'name of the category',
    type: String,
  })
  inventoryId: string;

  // @ApiProperty({
  //   description: 'address of the store',
  //   type: String,
  // })
  // inventory: InventoryEntity;

  // get product and store from inventory

  @ApiProperty({
    description: 'store id of the category',
    type: String,
  })
  enterpriseId: string;

  @ApiProperty({
    description: 'store id of the category',
    type: String,
  })
  quantity: number;

  @ApiProperty({
    description: 'store id of the category',
    type: String,
  })
  type: MovementType;

  @ApiProperty({
    description: 'store id of the category',
    type: String,
  })
  reason: string;

  @ApiProperty({
    description: 'creation date of the category',
    type: String,
  })
  createdAt: Date;

  @Exclude()
  inventory?: object;

  constructor(partial: Partial<StockMovement>) {
    Object.assign(this, partial);
  }
}
