import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(enterpriseId: string, data: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        ...data,
        enterpriseId,
      },
    });
  }

  findById(id: string) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }

  findByName(enterpriseId: string, name: string) {
    return this.prisma.category.findUnique({
      where: { name_enterpriseId: { enterpriseId, name } },
    });
  }

  list(
    enterpriseId: string,
    where: Prisma.CategoryWhereInput,
    orderBy: Prisma.CategoryOrderByWithAggregationInput,
    page: number = 1,
    limit: number = 20,
  ) {
    return this.prisma.xprisma.category.paginate({
      where: { ...where, enterpriseId },
      orderBy,
      page,
      limit,
    });
  }

  update(id: string, data: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
