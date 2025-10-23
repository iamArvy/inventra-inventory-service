import { PrismaService } from './prisma.service';

export function prismaTenantFactory(
  prisma: PrismaService,
  tenant_id: string,
): PrismaService {
  return prisma.$extends({
    query: {
      $allModels: {
        $allOperations({ args, query }) {
          if ('where' in args) {
            args.where = { ...args.where, tenant_id };
          }
          if ('data' in args) {
            if (Array.isArray(args.data)) {
              args.data = args.data.map(
                <T extends Record<string, any>>(d: T) => ({ ...d, tenant_id }),
              );
            } else {
              args.data = { ...args.data, tenant_id };
            }
          }

          if ('create' in args) {
            args.create = { ...args.create, tenant_id };
          }

          return query(args);
        },
      },
    },
  }) as PrismaService;
}
