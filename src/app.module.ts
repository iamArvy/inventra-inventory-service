import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { ClsModule } from 'nestjs-cls';
import { ProductModule } from './modules/product/product.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { APP_GUARD } from '@nestjs/core';
import { TenantGuard } from './common/guards/tenant.guard';

@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup: (cls, req: Request) => {
          cls.set('tenantId', req.headers['x-tenant-id']);
        },
      },
      global: true,
    }),
    PrismaModule,
    EventEmitterModule.forRoot(),
    ProductModule,
    WarehouseModule,
    InventoryModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
  ],
})
export class AppModule {}
