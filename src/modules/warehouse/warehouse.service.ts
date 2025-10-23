import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateWarehouseDto,
  PatchWarehouseDto,
  WarehouseQueryDto,
} from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cls: ClsService,
  ) {}

  private readonly logger = new Logger(WarehouseService.name);

  private async getWarehouseWithName(name: string) {
    const tenant_id = this.cls.get<string>('tenantId');
    return this.prisma.instance.warehouse.findUnique({
      where: { tenant_id_name: { tenant_id, name } },
    });
  }

  async create(data: CreateWarehouseDto) {
    const existing = await this.getWarehouseWithName(data.name);

    if (existing) throw new ConflictException('Warehouse with name exists');

    const warehouse = await this.prisma.instance.warehouse.create({
      // @ts-expect-error tenant_id already added from prisma
      data,
    });

    this.logger.log(`Warehouse with id ${warehouse.id} created`);

    return warehouse;
  }

  async get(id: string) {
    const warehouse = await this.prisma.instance.warehouse.findUnique({
      where: { id },
    });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    return warehouse;
  }

  async list(query: WarehouseQueryDto) {
    const { sortBy, order, page, limit, name, status } = query;
    const orderBy = { [sortBy ?? 'createdAt']: order };

    const result = await this.prisma.instance.xprisma.warehouse.paginate({
      where: {
        name,
        status,
      },
      orderBy,
      page: page ?? 1,
      limit: limit ?? 20,
    });

    return result;
  }

  async update(id: string, data: PatchWarehouseDto) {
    const warehouse = await this.prisma.instance.warehouse.findUnique({
      where: { id },
    });
    if (!warehouse) throw new NotFoundException('Warehouse not found');

    if (data.name) {
      const existing = await this.getWarehouseWithName(data.name);

      if (existing && existing.id !== warehouse.id)
        throw new ConflictException('Warehouse with name exists');
    }

    const update = await this.prisma.warehouse.update({ where: { id }, data });

    this.logger.log(`Warehouse with id ${id} updated`);

    return update;
  }

  async delete(id: string) {
    const warehouse = await this.prisma.instance.warehouse.findUnique({
      where: { id },
    });
    if (!warehouse) throw new NotFoundException('Warehouse not found');
    if (warehouse.deletedAt)
      throw new BadRequestException('Warehouse already deleted');
    await this.prisma.warehouse.update({
      where: { id: warehouse.id },
      data: { deletedAt: new Date() },
    });
    this.logger.log(`Warehouse with id ${id} deleted`);
    return { success: true };
  }
}
