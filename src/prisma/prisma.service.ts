import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { extension } from 'prisma-paginate';
import { prismaTenantFactory } from './prisma-tenant.factory';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  xprisma = this.$extends(extension);

  constructor(private readonly cls: ClsService) {
    super({
      log: ['query'],
    });
  }
  async onModuleInit() {
    await this.$connect();
  }

  get instance(): PrismaService {
    const tenantId = this.cls.get<string>('tenantId');
    return prismaTenantFactory(this, tenantId);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
