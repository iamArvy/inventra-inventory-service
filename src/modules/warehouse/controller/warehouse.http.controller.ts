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
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiQuery,
  ApiParam,
  ApiConflictResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { WarehouseService } from '../service';
import {
  CreateWarehouseDto,
  PatchWarehouseDto,
  UpdateWarehouseDto,
  WarehouseDto,
  WarehouseQueryDto,
} from '../dto';

@ApiSecurity('tenant-key')
@ApiTags('Warehouses')
@Controller('warehouses')
export class WarehouseController {
  constructor(private readonly service: WarehouseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiCreatedResponse({
    description: 'Warehouse created successfully',
    type: WarehouseDto,
  })
  @ApiBadRequestResponse({ description: 'Invalid warehouse data' })
  @ApiConflictResponse({ description: 'Warehouse with name exists' })
  create(@Body() data: CreateWarehouseDto) {
    return this.service.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve warehouse details by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Warehouse ID' })
  @ApiOkResponse({
    description: 'Returns the warehouse details',
    type: WarehouseDto,
  })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get()
  @ApiOperation({ summary: 'List warehouses with optional filters' })
  @ApiQuery({ type: WarehouseQueryDto, required: false })
  @ApiOkResponse({
    description: 'Returns a list of warehouses',
    type: [WarehouseDto],
  })
  list(@Query() query: WarehouseQueryDto) {
    return this.service.list(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update warehouse details (full update)' })
  @ApiParam({ name: 'id', type: String, description: 'Warehouse ID' })
  @ApiOkResponse({
    description: 'Warehouse updated successfully',
    type: WarehouseDto,
  })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  @ApiBadRequestResponse({ description: 'Invalid warehouse data' })
  update(@Param('id') id: string, @Body() data: UpdateWarehouseDto) {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update warehouse details' })
  @ApiParam({ name: 'id', type: String, description: 'Warehouse ID' })
  @ApiOkResponse({
    description: 'Warehouse updated successfully',
    type: WarehouseDto,
  })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  @ApiBadRequestResponse({ description: 'Invalid partial update data' })
  patch(@Param('id') id: string, @Body() data: PatchWarehouseDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a warehouse by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Warehouse ID' })
  @ApiOkResponse({ description: 'Warehouse deleted successfully' })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  @ApiBadRequestResponse({ description: 'Warehouse already deleted' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
