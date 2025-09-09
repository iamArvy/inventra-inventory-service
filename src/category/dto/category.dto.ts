import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CategoryDocument } from 'src/category/schema/category.schema';
export class CategoryDto {
  @Expose()
  @ApiProperty({
    description: 'id of the category',
    type: String,
  })
  @Transform(({ obj }: { obj: CategoryDocument }) => obj._id.toString())
  id: string;

  @ApiProperty({
    description: 'name of the category',
    type: String,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'description of the category',
    type: String,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'image of the category',
    type: String,
  })
  @Expose()
  image?: string;

  @ApiProperty({
    description: 'store id of the category',
    type: String,
  })
  @IsNotEmpty()
  @Expose()
  @IsString()
  storeId: string;

  @ApiProperty({
    description: 'creation date of the category',
    type: String,
  })
  @Expose()
  createdAt: Date;

  static from(data: CategoryDocument): CategoryDto {
    return plainToInstance(CategoryDto, data, {
      excludeExtraneousValues: true,
    });
  }

  static fromMany(data: CategoryDocument[]): CategoryDto[] {
    return plainToInstance(CategoryDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
