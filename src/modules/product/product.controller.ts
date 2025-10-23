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
import { ProductService } from './product.service';
import {
  CreateProductDto,
  PaginatedProductDto,
  PatchProductDto,
  ProductDto,
  ProductQueryDto,
  UpdateProductDto,
} from './dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';

@ApiSecurity('tenant-key')
@ApiSecurity('admin-key')
@Controller('products')
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({
    description: 'Product created successfully',
    type: ProductDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input or missing required fields',
  })
  @ApiBadRequestResponse({
    description: 'Product with sku exists',
  })
  @ApiConflictResponse({ description: 'Product with sku exists' })
  create(@Body() data: CreateProductDto) {
    return this.service.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductDto,
  })
  @ApiNotFoundResponse({ description: 'Product not found' })
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Get()
  @ApiOperation({ summary: 'List all products with optional filters' })
  @ApiQuery({ type: ProductQueryDto, required: false })
  @ApiOkResponse({
    description: 'List of products retrieved successfully',
    type: PaginatedProductDto,
  })
  list(@Query() query: ProductQueryDto) {
    return this.service.list(query);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product (replace entire record)' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ description: 'Product updated successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({
    description: 'Product with sku exists',
  })
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.update(id, data);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Partially update a product' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiBody({ type: PatchProductDto })
  @ApiOkResponse({ description: 'Product patched successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({
    description: 'Product with sku exists',
  })
  patch(@Param('id') id: string, @Body() data: PatchProductDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Product ID' })
  @ApiOkResponse({ description: 'Product deleted successfully' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Product already deleted' })
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
