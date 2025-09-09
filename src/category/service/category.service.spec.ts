import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { CategoryRepository, mockCategoryRepository } from '../repository';
import {
  mockProductRepository,
  ProductRepository,
} from 'src/product/repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryDto, CategorySortBy, PaginatedCategoryDto } from '../dto';
import { SortOrder } from 'src/common/dto';
import { mockCategoryEvent } from '../event/categpry.event.mock';
import { CategoryEvent } from '../event';

describe('CategoryService', () => {
  let service: CategoryService;
  let productRepo: ReturnType<typeof mockProductRepository>;
  let categoryRepo: ReturnType<typeof mockCategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: ProductRepository,
          useFactory: mockProductRepository,
        },
        {
          provide: CategoryRepository,
          useFactory: mockCategoryRepository,
        },
        {
          provide: CategoryEvent,
          useFactory: mockCategoryEvent,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    productRepo = module.get(ProductRepository);
    categoryRepo = module.get(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if name already exists', async () => {
      categoryRepo.findByName.mockResolvedValueOnce({
        id: 'id',
      });
      await expect(
        service.create({
          storeId: 'store1',
          name: 'cat1',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create category if validation passes', async () => {
      categoryRepo.findByName.mockResolvedValueOnce(null);
      categoryRepo.create.mockResolvedValueOnce({ _id: 'prod1' });

      const result = await service.create({
        storeId: 'store1',
        name: 'cat1',
      });

      expect(result).toBeInstanceOf(CategoryDto);
      expect(categoryRepo.create).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should throw if id is invalid', async () => {
      categoryRepo.findByIdOrThrow.mockRejectedValueOnce(
        new BadRequestException(),
      );
      await expect(service.get('invalid')).rejects.toThrow(BadRequestException);
    });

    it('should throw if category does not exist', async () => {
      categoryRepo.findByIdOrThrow.mockRejectedValueOnce(
        new NotFoundException(),
      );
      await expect(service.get('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should return category if id is valid', async () => {
      const category = { _id: 'p1' };
      categoryRepo.findByIdOrThrow.mockResolvedValueOnce(category);
      const result = await service.get('id');
      expect(result).toBeInstanceOf(CategoryDto);
    });
  });

  describe('list', () => {
    it('should call repo.list with filters and options', async () => {
      categoryRepo.list.mockResolvedValueOnce({ docs: [], totalDocs: 0 });
      const result = await service.list({
        sortBy: CategorySortBy.NAME,
        order: SortOrder.ASC,
      });
      expect(categoryRepo.list).toHaveBeenCalled();
      expect(result).toBeInstanceOf(PaginatedCategoryDto);
    });
  });

  describe('update', () => {
    it('should throw if category not found', async () => {
      categoryRepo.findByIdOrThrow.mockRejectedValueOnce(
        new NotFoundException(),
      );
      await expect(service.update('id', {})).rejects.toThrow(NotFoundException);
    });

    it('should throw if name is taken by another category', async () => {
      categoryRepo.findByIdOrThrow.mockResolvedValueOnce({
        storeId: 'store1',
        name: 'oldsku',
      });
      categoryRepo.findByName.mockResolvedValueOnce({
        id: 'otherId',
      });

      await expect(
        service.update('id', {
          name: 'newsku',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update successfully', async () => {
      categoryRepo.findByIdOrThrow.mockResolvedValueOnce({
        storeId: 'store1',
        name: 'name',
      } as any);
      categoryRepo.findByName.mockResolvedValueOnce(null);

      categoryRepo.update.mockResolvedValueOnce({ success: true } as any);
      const result = await service.update('id', { name: 'name' });
      expect(result).toEqual({ success: true });
    });
  });

  describe('delete', () => {
    it('should throw if category not found', async () => {
      categoryRepo.findByIdOrThrow.mockRejectedValueOnce(
        new NotFoundException(),
      );
      await expect(service.update('id', {})).rejects.toThrow(NotFoundException);
    });

    it('should throw if product count > 0', async () => {
      categoryRepo.findByIdOrThrow.mockResolvedValueOnce({ _id: 'id' });
      productRepo.count.mockResolvedValueOnce(1);
      await expect(service.delete('id')).rejects.toThrow(BadRequestException);
    });

    it('should delete successfully', async () => {
      productRepo.findByIdOrThrow.mockResolvedValueOnce({} as any);
      productRepo.count.mockResolvedValueOnce(0);

      categoryRepo.delete.mockResolvedValueOnce({ success: true });
      const result = await service.delete('id');
      expect(result).toEqual({ success: true });
    });
  });
});
