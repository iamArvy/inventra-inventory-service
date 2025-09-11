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
import { CategoryService } from '../service';
import {
  CategoryQueryDto,
  CreateCategoryInput,
  PaginatedCategoryDto,
  UpdateCategoryDto,
} from '../dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Status } from 'src/common/dto/app.response';
import { CategoryEntity } from '../entity';
import { EnterpriseInput } from 'src/common/dto';

@ApiTags('Category')
@Controller('categories')
export class CategoryHttpController {
  constructor(private readonly service: CategoryService) {}

  @ApiOkResponse({
    description: 'New category created',
    type: CategoryEntity,
  })
  @ApiBadRequestResponse({
    description: 'Category with name already exist for this store',
  })
  @Put()
  create(@Body() { enterpriseId, data }: CreateCategoryInput) {
    return this.service.create(enterpriseId, data);
  }

  @ApiOkResponse({
    description: 'Category',
    type: CategoryEntity,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @ApiOkResponse({
    description: 'Paginated Category List',
    type: PaginatedCategoryDto,
  })
  @Get()
  list(
    @Body() { enterpriseId }: EnterpriseInput,
    @Query() query: CategoryQueryDto,
  ) {
    return this.service.list(enterpriseId, query);
  }

  @ApiOkResponse({
    description: 'Status of the request',
    type: Status,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid Category ID format | Category with name already exists',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.service.update(id, data);
  }

  @ApiOkResponse({
    description: 'Status of the request',
    type: Status,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid category ID format | Cannot delete category with existing products',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
