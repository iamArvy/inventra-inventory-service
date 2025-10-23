import { Controller, Get } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';

@ApiSecurity('tenant-key')
@ApiSecurity('admin-key')
@Controller()
export class AppController {
  @Get('health')
  getHealth(): { status: string } {
    return { status: 'healthy' };
  }
}
