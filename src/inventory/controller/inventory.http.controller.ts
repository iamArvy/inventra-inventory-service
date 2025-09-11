import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InventoryService } from '../service';
import {
  CreateInventoryInput,
  PaginatedInventoryDto,
  InventoryQueryDto,
  UpdateInventoryDto,
  UpdateStockInput,
  ListMovementDto,
} from '../dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Status } from 'src/common/dto/app.response';
import { InventoryEntity } from '../entity';
import { EnterpriseInput } from 'src/common/dto';
import { MovementType } from '@prisma/client';

@ApiTags('Store')
@Controller('stores')
export class InventoryHttpController {
  constructor(private readonly service: InventoryService) {}

  @ApiOkResponse({
    description: 'New Inventory created',
    type: InventoryEntity,
  })
  @ApiBadRequestResponse({
    description: 'Store with name already exist',
  })
  @Put()
  create(
    @Body() { enterpriseId, productId, storeId, data }: CreateInventoryInput,
  ) {
    return this.service.create(enterpriseId, productId, storeId, data);
  }

  @ApiOkResponse({
    description: 'Store',
    type: InventoryEntity,
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
    type: PaginatedInventoryDto,
  })
  @Get()
  list(
    @Body() { enterpriseId }: EnterpriseInput,
    @Query() query: InventoryQueryDto,
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
  update(@Param('id') id: string, @Body() data: UpdateInventoryDto) {
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

  @Post(':id/increase-stock')
  increaseStock(
    @Param('id') id: string,
    @Body() { enterpriseId, data }: UpdateStockInput,
  ) {
    return this.service.updateStock(
      enterpriseId,
      id,
      MovementType.INCREASE,
      data,
    );
  }

  @Post(':id/decrease-stock')
  decreaseStock(
    @Param('id') id: string,
    @Body() { enterpriseId, data }: UpdateStockInput,
  ) {
    return this.service.updateStock(
      enterpriseId,
      id,
      MovementType.DECREASE,
      data,
    );
  }

  @Get(':id/movements')
  listMovements(
    @Param('id') id: string,
    @Body() { enterpriseId, query }: ListMovementDto,
  ) {
    return this.service.listMovement(enterpriseId, id, query);
  }

  @Get(':id/movements/:movementId')
  getMovement(
    // @Param('id') id: string,
    @Param('movementId') movementId: string,
  ) {
    return this.service.getMovement(movementId);
  }
}
