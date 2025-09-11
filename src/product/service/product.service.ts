import { ProductEntity } from './../entity/product.entity';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductDto,
  PaginatedProductDto,
  ProductQueryDto,
  UpdateProductDto,
  UpdateStockDto,
} from '../dto';
import { ProductRepository } from '../repository';
import { CategoryRepository } from 'src/category/repository';
// import { ProductEvent } from '../event';
import { MovementType, Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(
    private repo: ProductRepository,
    private categoryRepo: CategoryRepository,
    // private event: ProductEvent,
  ) {}

  private readonly logger = new Logger(ProductService.name);

  /**
   * Create a new product
   * @param data - Product input data
   */
  async create(enterpriseId: string, data: CreateProductDto) {
    // const { enterpriseId, categoryId, ...rest } = data;
    const exists = await this.repo.findBySku(enterpriseId, data.sku);
    if (exists) {
      throw new BadRequestException('Product with this SKU already exists');
    }

    const category = await this.categoryRepo.findById(data.categoryId);
    if (!category || category.enterpriseId !== enterpriseId) {
      throw new BadRequestException('Category does not exist');
    }

    const product = await this.repo.create(enterpriseId, data);

    // this.logger.log(`Product ${product.id} Created in store ${enterpriseId}`);
    // this.event.created(product);
    return new ProductEntity(product);
  }

  /**
   * Get a product by ID
   * @param id - Product ID
   */
  async get(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return new ProductEntity(product);
  }

  /**
   * List products with optional filtering and pagination
   * @param query - Product query parameters
   */
  async list(enterpriseId: string, query: ProductQueryDto) {
    const {
      sortBy,
      order,
      page,
      limit,
      name,
      sku,
      categoryId,
      // deleted,
      // tags,
    } = query;

    const orderBy = { [sortBy ?? 'createdAt']: order };

    const filter: Prisma.ProductWhereInput = {};
    if (name) filter.name = name;
    if (sku) filter.sku = sku;
    if (categoryId) filter.categoryId = categoryId;
    if (enterpriseId) filter.enterpriseId = enterpriseId;
    // if (deleted) filter.deletedAt = deleted ? {  } : { $exists: false };

    // if (tags && tags.length > 0) {
    //   filter.tags = {  tags} { $in: tags };
    // }

    const result = await this.repo.list(
      enterpriseId,
      filter,
      orderBy,
      page,
      limit,
    );
    return PaginatedProductDto.from(result);
  }

  /**
   * Update a product
   * @param id - Product ID
   * @param data - Product update data
   */
  async update(id: string, data: UpdateProductDto) {
    const { categoryId, sku } = data;

    const product = await this.repo.findById(id);

    if (!product) throw new NotFoundException('Product not found');

    if (product.deletedAt) {
      throw new BadRequestException('Product already deleted');
    }

    if (sku && sku !== product.sku) {
      const exists = await this.repo.findBySku(product.enterpriseId, sku);
      if (exists && exists.id !== id) {
        throw new BadRequestException('Product with this SKU already exists');
      }
    }

    if (categoryId && categoryId !== product.categoryId) {
      const category = await this.categoryRepo.findById(categoryId);
      if (!category || category.enterpriseId !== product.enterpriseId) {
        throw new BadRequestException('Category does not exist');
      }
    }
    await this.repo.update(id, data);
    // this.logger.log(`Product ${id} updated`);
    // this.event.updated(id, data);
    return { success: true };
  }

  /**
   * Delete a product
   * @param id - Product ID
   */
  async delete(id: string) {
    const product = await this.repo.findById(id);

    if (!product) throw new NotFoundException('Product not found');

    if (product.deletedAt) {
      throw new BadRequestException('Product already deleted');
    }
    await this.repo.softDelete(id);
    // this.logger.log(`Product ${id} deleted`);
    // this.event.deleted(id);
    return { success: true };
  }

  /**
   * List products with optional filtering and pagination
   * @param query - Product query parameters
   */
  async inventories(id: string) {
    // const {
    //   sortBy,
    //   order,
    //   page,
    //   limit,
    //   name,
    //   sku,
    //   categoryId,
    //   // deleted,
    //   // tags,
    // } = query;

    // const orderBy = { [sortBy ?? 'createdAt']: order };

    // const filter: Prisma.ProductWhereInput = {};
    // if (name) filter.name = name;
    // if (sku) filter.sku = sku;
    // if (categoryId) filter.categoryId = categoryId;
    // if (enterpriseId) filter.enterpriseId = enterpriseId;
    // if (deleted) filter.deletedAt = deleted ? {  } : { $exists: false };

    // if (tags && tags.length > 0) {
    //   filter.tags = {  tags} { $in: tags };
    // }

    const result = await this.repo.inventories(id);
    return result;
  }

  async updateStock(
    id: string,
    storeId: string,
    type: MovementType,
    data: UpdateStockDto,
  ) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const inventory = await this.repo.inventory(id, storeId);

    if (!inventory)
      throw new BadRequestException(
        'No Inventory found for this product in this store',
      );

    if (type == MovementType.DECREASE && data.quantity > inventory.quantity)
      throw new BadRequestException('Not enough product in stock');
    await this.repo.updateStock(inventory.id, product.enterpriseId, type, data);

    // To be put in event later
    // innnnnnnnnnnnnnncreate orrrrrrrrrrrr reducc
    return { success: true };
  }
  // implement createMany and deleteMany
  // update stock - increase and decrease in controller
}
