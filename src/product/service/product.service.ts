import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import {
  CreateProductDto,
  PaginatedProductDto,
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from '../dto';
import { ProductRepository } from '../repository';
import { FilterQuery, Types } from 'mongoose';
import { Product } from '../schema';
import { SortOrder } from 'src/common/dto';
import { CategoryRepository } from 'src/category/repository';
import { ProductEvent } from '../event';

@Injectable()
export class ProductService {
  constructor(
    private repo: ProductRepository,
    private categoryRepo: CategoryRepository,
    private event: ProductEvent,
  ) {}

  private readonly logger = new Logger(ProductService.name);

  /**
   * Create a new product
   * @param data - Product input data
   */
  async create(data: CreateProductDto) {
    const { storeId, categoryId, ...rest } = data;
    const exists = await this.repo.findByStoreIdAndSku(storeId, data.sku);
    if (exists) {
      throw new BadRequestException('Product with this SKU already exists');
    }
    const category = await this.categoryRepo.findById(categoryId);
    if (!category || category.storeId !== storeId) {
      throw new BadRequestException('Category does not exist');
    }
    const product = ProductDto.from(
      await this.repo.create({
        ...rest,
        storeId,
        category: category._id,
      }),
    );
    this.logger.log(`Product ${product.id} Created in store ${storeId}`);
    this.event.created(product);
    return product;
  }

  /**
   * Get a product by ID
   * @param id - Product ID
   */
  async get(id: string) {
    const product = await this.repo.findByIdWithRelationships(id, ['category']);
    return ProductDto.from(product);
  }

  /**
   * List products with optional filtering and pagination
   * @param query - Product query parameters
   */
  async list(query: ProductQueryDto) {
    const {
      sortBy,
      order,
      page,
      pageSize,
      name,
      sku,
      categoryId,
      storeId,
      deleted,
      tags,
      minPrice,
      maxPrice,
      minStock,
      maxStock,
    } = query;
    const sortField = sortBy ?? 'createdAt'; // default fallback
    const sortOrder = order === SortOrder.DESC ? -1 : 1;
    const options = {
      page: page ?? 1,
      limit: pageSize ?? 10,
      sort: { [sortField]: sortOrder },
    };

    const filter: FilterQuery<Product> = {};
    if (name) filter.name = name;
    if (sku) filter.sku = sku;
    if (categoryId) filter.category = categoryId;
    if (storeId) filter.storeId = storeId;
    if (deleted)
      filter.deletedAt = deleted ? { $exists: true } : { $exists: false };

    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {
        ...(minPrice !== undefined && { $gte: Number(minPrice) }),
        ...(maxPrice !== undefined && { $lte: Number(maxPrice) }),
      };
    }

    if (minStock !== undefined || maxStock !== undefined) {
      filter.stock = {
        ...(minStock !== undefined && { $gte: Number(minStock) }),
        ...(maxStock !== undefined && { $lte: Number(maxStock) }),
      };
    }
    const result = await this.repo.list(filter, options);
    return PaginatedProductDto.from(result);
  }

  /**
   * Update a product
   * @param id - Product ID
   * @param data - Product update data
   */
  async update(id: string, data: UpdateProductDto) {
    const { categoryId, sku, ...rest } = data;
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    const product = await this.repo.findByIdWithRelationships(id, ['category']);

    if (product.deletedAt) {
      throw new BadRequestException('Product already deleted');
    }

    if (sku && sku !== product.sku) {
      const exists = await this.repo.findByStoreIdAndSku(product.storeId, sku);
      if (exists && exists.id !== id) {
        throw new BadRequestException('Product with this SKU already exists');
      }
    }

    if (categoryId && categoryId !== product.category._id.toString()) {
      const category = await this.categoryRepo.findByIdOrThrow(categoryId);
      if (!category || category.storeId !== product.storeId) {
        throw new BadRequestException('Category does not exist');
      }
    }
    await this.repo.update(id, {
      ...rest,
      sku,
      category: categoryId,
    });
    this.logger.log(`Product ${id} updated`);
    this.event.updated(id, data);
    return { success: true };
  }

  /**
   * Delete a product
   * @param id - Product ID
   */
  async delete(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    const product = await this.repo.findByIdOrThrow(id);
    if (product.deletedAt) {
      throw new BadRequestException('Product already deleted');
    }
    await this.repo.softDelete(id);
    this.logger.log(`Product ${id} deleted`);
    this.event.deleted(id);
    return { success: true };
  }

  // implement createMany and deleteMany
}
