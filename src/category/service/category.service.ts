import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CategoryQueryDto,
  CreateCategoryDto,
  PaginatedCategoryDto,
  UpdateCategoryDto,
} from '../dto';
import { CategoryRepository } from '../repository';
import { ProductRepository } from 'src/product/repository';
// import { CategoryEvent } from '../event';
import { Prisma } from '@prisma/client';
import { CategoryEntity } from '../entity';

@Injectable()
export class CategoryService {
  constructor(
    private readonly repo: CategoryRepository,
    private readonly productRepo: ProductRepository,
    // private readonly event: CategoryEvent,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  /**
   * Create a new category
   * @param store_id - ID of the store
   * @param data - Category input data
   */
  async create(enterpriseId: string, data: CreateCategoryDto) {
    const exists = await this.repo.findByName(enterpriseId, data.name);
    if (exists)
      throw new BadRequestException(
        'Category with name already exist for this store',
      );
    const category = await this.repo.create(enterpriseId, data);
    // this.logger.log(`Category ${category.id} created in store ${enterpriseId}`);
    // this.event.created(category);
    return new CategoryEntity(category);
  }

  /**
   * Get a category by ID
   * @param id - Category ID
   */
  async get(id: string) {
    const category = await this.repo.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return new CategoryEntity(category);
  }

  /**
   * List categories with optional filtering and pagination
   * @param query - Category query parameters
   */
  async list(enterpriseId: string, query: CategoryQueryDto) {
    const { sortBy, order, page, limit, name } = query;
    const orderBy = { [sortBy ?? 'createdAt']: order };

    const filter: Prisma.CategoryWhereInput = {};
    if (name) filter.name = query.name;
    if (enterpriseId) filter.enterpriseId = enterpriseId;

    const result = await this.repo.list(
      enterpriseId,
      filter,
      orderBy,
      page,
      limit,
    );
    return new PaginatedCategoryDto(result);
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Partial category input data
   */
  async update(id: string, data: UpdateCategoryDto) {
    const category = await this.repo.findById(id);
    if (!category) throw new NotFoundException('Category not found');

    if (data.name && data.name !== category.name) {
      const exists = await this.repo.findByName(
        category.enterpriseId,
        data.name,
      );
      if (exists && exists.id !== id)
        throw new BadRequestException('Category with name already exists');
    }

    await this.repo.update(id, data);
    // this.logger.log(`Category ${id} updated successfully`);
    // this.event.updated(id, data);
    return { success: true };
  }

  /**
   * Delete a category
   * @param id - Category ID
   */
  async delete(id: string) {
    const category = await this.repo.findById(id);

    if (!category) throw new NotFoundException('Category not found');

    const productCount = await this.productRepo.count(category.enterpriseId, {
      categoryId: id,
    });
    if (productCount > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing products',
      );
    }
    await this.repo.delete(id);
    // this.logger.log(`Category ${id} deleted successfully`);
    // this.event.deleted(id);
    return { success: true };
  }

  // implement createMany and deleteMany
}
