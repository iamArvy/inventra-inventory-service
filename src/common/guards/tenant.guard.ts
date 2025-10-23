import { CanActivate, Injectable, ForbiddenException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly cls: ClsService) {}

  canActivate(): boolean {
    const tenantId = this.cls.get<string>('tenantId');
    if (tenantId) {
      return true;
    }

    throw new ForbiddenException(
      'Access denied: request must include tenant identifier',
    );
  }
}
