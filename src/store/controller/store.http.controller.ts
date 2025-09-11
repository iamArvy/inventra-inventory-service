import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { StoreService } from '../service';
import {
  CreateStoreInput,
  PaginatedStoreDto,
  StoreQueryDto,
  UpdateStoreDto,
} from '../dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Status } from 'src/common/dto/app.response';
import { StoreEntity } from '../entity';
import { EnterpriseInput } from 'src/common/dto';

@ApiTags('Store')
@Controller('stores')
export class StoreHttpController {
  constructor(private readonly service: StoreService) {}

  @ApiOkResponse({
    description: 'New Store created',
    type: StoreEntity,
  })
  @ApiBadRequestResponse({
    description: 'Store with name already exist',
  })
  @Put()
  create(@Body() { enterpriseId, data }: CreateStoreInput) {
    return this.service.create(enterpriseId, data);
  }

  @ApiOkResponse({
    description: 'Store',
    type: StoreEntity,
  })
  @ApiNotFoundResponse({
    description: 'Store not found',
  })
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @ApiOkResponse({
    description: 'Paginated Store List',
    type: PaginatedStoreDto,
  })
  @Get()
  list(
    @Body() { enterpriseId }: EnterpriseInput,
    @Query() query: StoreQueryDto,
  ) {
    return this.service.list(enterpriseId, query);
  }

  @ApiOkResponse({
    description: 'Status of the request',
    type: Status,
  })
  @ApiBadRequestResponse({
    description: 'Store with name already exists',
  })
  @ApiNotFoundResponse({
    description: 'Store not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateStoreDto) {
    return this.service.update(id, data);
  }

  @ApiOkResponse({
    description: 'Status of the request',
    type: Status,
  })
  @ApiBadRequestResponse({
    description: 'Store already deleted',
  })
  @ApiNotFoundResponse({
    description: 'Store not found',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @ApiOkResponse({
    description: 'Paginated Store List',
    type: PaginatedStoreDto,
  })
  @Get(':id/inventories')
  inventories(@Param('id') id: string) {
    return this.service.inventories(id);
  }
}
