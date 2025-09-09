import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { CategoryDocument } from 'src/category/schema';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { Factory } from 'nestjs-seeder';
import type { Faker } from '@faker-js/faker';
export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Factory((faker: Faker) => faker.commerce.productName())
  @Prop({ type: String, required: true })
  name: string;

  @Factory((faker: Faker) => faker.commerce.productDescription())
  @Prop({ type: String })
  description?: string;

  @Factory((faker: Faker) => faker.image.url())
  @Prop({ type: String })
  image?: string;

  @Factory((faker: Faker) => faker.string.alphanumeric(10))
  @Prop({ type: String, required: true })
  sku: string;

  @Factory((faker: Faker) => faker.string.uuid())
  @Prop({ type: String, required: true })
  storeId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Types.ObjectId | CategoryDocument;

  @Factory((faker: Faker) => [
    faker.string.alpha({ length: 5, casing: 'lower' }),
    faker.string.alpha({ length: 5, casing: 'lower' }),
    faker.string.alpha({ length: 5, casing: 'lower' }),
  ])
  @Prop({ type: [String], default: [] })
  tags?: string[];

  @Factory((faker: Faker) =>
    Number(faker.commerce.price({ min: 1, max: 1000, dec: 2 })),
  )
  @Prop({ type: Number, default: 0 })
  price: number;

  @Factory((faker: Faker) => ({
    color: faker.color.human(),
    size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL']),
    material: faker.helpers.arrayElement(['cotton', 'polyester', 'wool']),
  }))
  @Prop({ type: Object, default: {} })
  attributes?: Record<string, any>;

  @Factory((faker: Faker) => faker.number.int({ min: 0, max: 100 }))
  @Prop({ type: Number, default: 0 })
  stock: number;

  @Factory((faker: Faker) => {
    return faker.datatype.boolean() ? faker.date.past() : undefined;
  })
  @Prop({ type: Date })
  deletedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.plugin(mongoosePaginate);
ProductSchema.index({ sku: 1, storeId: 1 }, { unique: true });
ProductSchema.index({ deletedAt: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ storeId: 1 });
ProductSchema.index(
  { name: 'text', description: 'text' },
  { weights: { name: 10, description: 5 }, name: 'ProductTextIndex' },
);
ProductSchema.index({ price: 1 });
ProductSchema.index({ stock: 1 });
