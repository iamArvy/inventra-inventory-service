import {
  UpdateProductDto,
  CreateProductDto,
  ProductQueryDto,
  PaginatedProductDto,
  CreateProductInput,
} from '../dto';
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
import { ProductService } from '../service/product.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Status } from 'src/common/dto/app.response';
import { ProductEntity } from '../entity';

@ApiTags('Product')
@Controller('products')
export class ProductHttpController {
  constructor(private readonly service: ProductService) {}

  /**
   * Create a product
   */
  @ApiOkResponse({
    description: 'New product',
    type: ProductEntity,
  })
  @ApiBadRequestResponse({
    description:
      'Category does not exist or Product with this SKU already exists',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product data to create',
  })
  @Put()
  create(@Body() { enterpriseId, data }: CreateProductInput) {
    return this.service.create(enterpriseId, data);
  }

  @ApiOkResponse({
    description: 'Product',
    type: ProductEntity,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @ApiOkResponse({
    description: 'List of products',
    type: PaginatedProductDto,
  })
  @Get()
  list(
    @Body('enterpriseId') enterpriseId: string,
    @Query() query: ProductQueryDto,
  ) {
    return this.service.list(enterpriseId, query);
  }

  @ApiOkResponse({
    description: 'Product updated successfully',
    type: Status,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid product ID format or Product already deleted or SKU already exists for the store or Category does not exist',
  })
  @ApiBody({
    type: UpdateProductDto,
    description: 'Product data to update',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.service.update(id, data);
  }

  @ApiOkResponse({
    description: 'Product deleted successfully',
    type: Status,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @ApiBadRequestResponse({
    description: 'Product already deleted',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @ApiOkResponse({
    description: 'get inventory across all stores',
    type: PaginatedProductDto,
  })
  @Get(':id/inventories')
  inventories(@Param('id') id: string) {
    return this.service.inventories(id);
  }
}
