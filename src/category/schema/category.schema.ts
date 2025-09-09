import { Faker } from '@faker-js/faker/.';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Factory } from 'nestjs-seeder';
import * as mongoosePaginate from 'mongoose-paginate-v2';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, collection: 'categories' })
export class Category {
  @Factory(() => `Category ${Math.floor(Math.random() * 1000)}`)
  @Prop()
  name: string;

  @Factory(() => `Description for ${Math.floor(Math.random() * 1000)}`)
  @Prop()
  description?: string;

  @Factory((faker: Faker) => faker.image.url())
  @Prop()
  image?: string;

  @Factory((faker: Faker) => faker.string.uuid())
  @Prop()
  storeId: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.plugin(mongoosePaginate);
CategorySchema.index({ name: 1, storeId: 1 }, { unique: true });
CategorySchema.index({ storeId: 1 });
