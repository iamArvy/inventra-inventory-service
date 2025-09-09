import {
  UpdateProductDto,
  CreateProductDto,
  ProductDto,
  ProductQueryDto,
  PaginatedProductDto,
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

@ApiTags('Product')
@Controller('products')
export class ProductHttpController {
  constructor(private readonly service: ProductService) {}

  @ApiOkResponse({
    description: 'New product',
    type: ProductDto,
  })
  @ApiBadRequestResponse({
    description:
      'Category does not exist or Product with this SKU already exists',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product data to create',
  })
  @Put('create')
  create(
    @Body('storeId') id: string,
    @Body() data: CreateProductDto,
  ): Promise<ProductDto> {
    return this.service.create(data);
  }

  @ApiOkResponse({
    description: 'Product',
    type: ProductDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
  })
  @Get('get/:id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @ApiOkResponse({
    description: 'List of products',
    type: PaginatedProductDto,
  })
  @Get('list')
  list(@Query() query: ProductQueryDto) {
    return this.service.list(query);
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
  @Patch('update/:id')
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
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
