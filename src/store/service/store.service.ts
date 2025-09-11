import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { StoreRepository } from '../repository';
import {
  CreateStoreDto,
  PaginatedStoreDto,
  StoreQueryDto,
  UpdateStoreDto,
} from '../dto';
import { StoreEntity } from '../entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class StoreService {
  constructor(
    private readonly repo: StoreRepository,
    // private readonly event: CategoryEvent,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  async findByIdOrThrow(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException('Store Not Found');
    return store;
  }
  /**
   * Create a new category
   * @param store_id - ID of the store
   * @param data - Category input data
   */
  async create(enterpriseId: string, data: CreateStoreDto) {
    const exists = await this.repo.findByName(enterpriseId, data.name);
    if (exists)
      throw new BadRequestException(
        'Store with name already exist for this store',
      );
    const store = await this.repo.create(enterpriseId, data);
    // this.logger.log(`Category ${category.id} created in store ${enterpriseId}`);
    // this.event.created(category);
    return new StoreEntity(store);
  }

  /**
   * Get a category by ID
   * @param id - Category ID
   */
  async get(id: string) {
    const store = await this.repo.findById(id);
    if (!store) throw new NotFoundException('Store not found');
    return new StoreEntity(store);
  }

  /**
   * List categories with optional filtering and pagination
   * @param query - Category query parameters
   */
  async list(enterpriseId: string, query: StoreQueryDto) {
    const { sortBy, order, page, limit, name } = query;
    const orderBy = { [sortBy ?? 'createdAt']: order };

    const filter: Prisma.StoreWhereInput = {};
    if (name) filter.name = query.name;
    if (enterpriseId) filter.enterpriseId = enterpriseId;

    const result = await this.repo.list(
      enterpriseId,
      filter,
      orderBy,
      page,
      limit,
    );
    return new PaginatedStoreDto(result);
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Partial category input data
   */
  async update(id: string, data: UpdateStoreDto) {
    const category = await this.repo.findById(id);
    if (!category) throw new NotFoundException('Store not found');

    if (data.name && data.name !== category.name) {
      const exists = await this.repo.findByName(
        category.enterpriseId,
        data.name,
      );
      if (exists && exists.id !== id)
        throw new BadRequestException('Store with name already exists');
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

    await this.repo.softDelete(id);
    // this.logger.log(`Category ${id} deleted successfully`);
    // this.event.deleted(id);
    return { success: true };
  }

  /**
   * List products with optional filtering and pagination
   * @param query - Product query parameters
   */
  async inventories(id: string) {
    await this.findByIdOrThrow(id);
    const result = await this.repo.inventories(id);
    return result;
  }
}
