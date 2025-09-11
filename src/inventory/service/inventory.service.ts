import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InventoryRepository, MovementRepository } from '../repository';
import {
  CreateInventoryDto,
  PaginatedInventoryDto,
  InventoryQueryDto,
  UpdateInventoryDto,
  UpdateStockDto,
  MovementQueryDto,
  PaginatedMovementDto,
} from '../dto';
import { InventoryEntity, MovementEntity } from '../entity';
import { MovementType, Prisma } from '@prisma/client';

@Injectable()
export class InventoryService {
  constructor(
    private readonly repo: InventoryRepository,
    private readonly movement: MovementRepository,
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
  async create(
    enterpriseId: string,
    productId: string,
    storeId: string,
    data: CreateInventoryDto,
  ) {
    const exists = await this.repo.findByProductAndStore(productId, storeId);
    if (exists)
      throw new BadRequestException(
        'Inventory already exist for product in this store',
      );
    const inventory = await this.repo.create(enterpriseId, data);
    // this.logger.log(`Category ${category.id} created in store ${enterpriseId}`);
    // this.event.created(category);
    return new InventoryEntity(inventory);
  }

  /**
   * Get a category by ID
   * @param id - Category ID
   */
  async get(id: string) {
    const inventory = await this.findByIdOrThrow(id);
    return new InventoryEntity(inventory);
  }

  /**
   * List categories with optional filtering and pagination
   * @param query - Category query parameters
   */
  async list(enterpriseId: string, query: InventoryQueryDto) {
    const { sortBy, order, page, limit, productId, storeId } = query;
    const orderBy = { [sortBy ?? 'createdAt']: order };

    const filter: Prisma.InventoryWhereInput = {};
    if (productId) filter.productId = productId;
    if (storeId) filter.storeId = storeId;

    const result = await this.repo.list(
      enterpriseId,
      filter,
      orderBy,
      page,
      limit,
    );
    return new PaginatedInventoryDto(result);
  }

  /**
   * Update a category
   * @param id - Category ID
   * @param data - Partial category input data
   */
  async update(id: string, data: UpdateInventoryDto) {
    await this.findByIdOrThrow(id);
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
    await this.findByIdOrThrow(id);
    await this.repo.softDelete(id);
    // this.logger.log(`Category ${id} deleted successfully`);
    // this.event.deleted(id);
    return { success: true };
  }

  async updateStock(
    enterpriseId: string,
    id: string,
    type: MovementType,
    data: UpdateStockDto,
  ) {
    const inventory = await this.findByIdOrThrow(id);
    if (type == MovementType.DECREASE && inventory.quantity < data.quantity)
      throw new BadRequestException('Not enough item in stock');
    return this.movement.create(enterpriseId, id, type, data);
  }

  /**
   * List categories with optional filtering and pagination
   * @param query - Category query parameters
   */
  async listMovement(
    enterpriseId: string,
    id: string,
    query: MovementQueryDto,
  ) {
    const { sortBy, order, page, limit, type } = query;
    const orderBy = { [sortBy ?? 'createdAt']: order };

    const filter: Prisma.StockMovementWhereInput = {};
    if (type) filter.type = type;

    const result = await this.movement.list(
      enterpriseId,
      filter,
      orderBy,
      page,
      limit,
      id,
    );
    return new PaginatedMovementDto(result);
  }

  /**
   * Get a category by ID
   * @param id - Category ID
   */
  async getMovement(id: string) {
    const movement = await this.movement.findById(id);
    if (!movement) throw new NotFoundException('Movement not found');
    return new MovementEntity(movement);
  }
}
