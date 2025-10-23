import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateInventoryDto,
  InventoryDto,
  InventoryQueryDto,
  PaginatedInventoryDto,
  PatchInventoryDto,
  UpdateInventoryDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiSecurity('tenant-key')
@ApiSecurity('admin-key')
@Controller('warehouses/:warehouseId/inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new inventory record for a product' })
  @ApiParam({ name: 'warehouseId', type: String, description: 'Warehouse ID' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiCreatedResponse({
    description: 'Inventory created successfully',
    type: InventoryDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or missing required fields',
  })
  create(
    @Param('warehouseId') warehouseId: string,
    @Body() data: CreateInventoryDto,
  ) {
    return this.service.create(warehouseId, data);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get inventory details for a specific product' })
  @ApiParam({ name: 'warehouseId', type: String })
  @ApiParam({ name: 'productId', type: String })
  @ApiOkResponse({
    description: 'Inventory record retrieved',
    type: InventoryDto,
  })
  @ApiNotFoundResponse({ description: 'Inventory not found' })
  get(
    @Param('warehouseId') warehouseId: string,
    @Param('productId') productId: string,
  ) {
    return this.service.get(warehouseId, productId);
  }

  @Get()
  @ApiOperation({ summary: 'List inventory items in a warehouse' })
  @ApiParam({ name: 'warehouseId', type: String })
  @ApiQuery({ type: InventoryQueryDto })
  @ApiOkResponse({
    description: 'List of inventory records',
    type: PaginatedInventoryDto,
  })
  list(
    @Param('warehouseId') warehouseId: string,
    @Query() query: InventoryQueryDto,
  ) {
    return this.service.list(warehouseId, query);
  }

  @Put(':productId')
  @ApiOperation({ summary: 'Update an inventory record (replace)' })
  @ApiParam({ name: 'warehouseId', type: String })
  @ApiParam({ name: 'productId', type: String })
  @ApiBody({ type: UpdateInventoryDto })
  @ApiOkResponse({ description: 'Inventory updated successfully' })
  @ApiNotFoundResponse({ description: 'Inventory not found' })
  @ApiBadRequestResponse({
    description: 'Invalid input or missing required fields',
  })
  update(
    @Param('warehouseId') warehouseId: string,
    @Param('productId') productId: string,
    @Body() data: UpdateInventoryDto,
  ) {
    return this.service.update(warehouseId, productId, data);
  }

  @Patch(':productId')
  @ApiOperation({ summary: 'Partially update an inventory record' })
  @ApiParam({ name: 'warehouseId', type: String })
  @ApiParam({ name: 'productId', type: String })
  @ApiBody({ type: UpdateInventoryDto })
  @ApiOkResponse({ description: 'Inventory updated successfully' })
  @ApiNotFoundResponse({ description: 'Inventory not found' })
  @ApiBadRequestResponse({
    description: 'Invalid input or missing required fields',
  })
  patch(
    @Param('warehouseId') warehouseId: string,
    @Param('productId') productId: string,
    @Body() data: PatchInventoryDto,
  ) {
    return this.service.update(warehouseId, productId, data);
  }
}
