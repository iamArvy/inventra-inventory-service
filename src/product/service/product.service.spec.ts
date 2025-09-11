import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { mockProductRepository, ProductRepository } from '../repository';
import { CategoryRepository, mockCategoryRepository } from 'src/category';
import { BadRequestException, Logger, NotFoundException } from '@nestjs/common';
import { SortOrder } from 'src/common/dto';
import { ProductSortBy } from '../dto';
import { ProductEntity } from '../entity';

describe('ProductService', () => {
  let service: ProductService;
  let productRepo: ReturnType<typeof mockProductRepository>;
  let categoryRepo: ReturnType<typeof mockCategoryRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useFactory: mockProductRepository,
        },
        {
          provide: CategoryRepository,
          useFactory: mockCategoryRepository,
        },
        // {
        //   provide: ProductEvent,
        //   useFactory: mockProductEvent,
        // },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get(ProductRepository);
    categoryRepo = module.get(CategoryRepository);

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  describe('create', () => {
    it('should throw if SKU already exists', async () => {
      productRepo.findBySku.mockResolvedValueOnce({
        id: 'id',
      });
      await expect(
        service.create('enterpriseId', {
          categoryId: 'cat1',
          description: 'description',
          sku: 'sku123',
          name: 'Prod',
          basePrice: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if category does not exist or enterpriseId mismatch', async () => {
      productRepo.findBySku.mockResolvedValueOnce(null);
      categoryRepo.findById.mockResolvedValueOnce(null);

      await expect(
        service.create('enterpriseId', {
          categoryId: 'cat1',
          description: 'description',
          sku: 'sku123',
          name: 'Prod',
          basePrice: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create product if validation passes', async () => {
      productRepo.findBySku.mockResolvedValueOnce(null);
      categoryRepo.findById.mockResolvedValueOnce({
        id: 'id',
        enterpriseId: 'store1',
      } as any);
      productRepo.create.mockResolvedValueOnce({
        id: 'prod1',
      } as ProductEntity);

      const result = await service.create('store1', {
        categoryId: 'cat1',
        description: 'description',
        sku: 'sku123',
        name: 'Prod',
        basePrice: 100,
      });

      expect(result).toEqual({
        id: 'prod1',
      });
      expect(productRepo.create).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should throw if product not found', async () => {
      productRepo.findById.mockResolvedValue(null);
      await expect(service.get('invalid')).rejects.toThrow(NotFoundException);
    });

    it('should return product if id is valid', async () => {
      const product = { id: 'p1' };
      productRepo.findById.mockResolvedValueOnce(product as any);
      const result = await service.get('id');
      expect(result).toBeInstanceOf(ProductEntity);
    });
  });

  describe('list', () => {
    it('should call repo.list with filters and options', async () => {
      productRepo.list.mockResolvedValueOnce({ docs: [], totalDocs: 0 });
      await service.list('enterpriseId', {
        sortBy: ProductSortBy.NAME,
        order: SortOrder.ASC,
        minPrice: 10,
        maxPrice: 100,
      });
      expect(productRepo.list).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should throw if product not found', async () => {
      productRepo.findById.mockResolvedValue(null);
      await expect(service.update('badid', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if product is deleted', async () => {
      productRepo.findById.mockResolvedValueOnce({
        deletedAt: new Date(),
      });
      await expect(service.update('id', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if SKU is taken by another product', async () => {
      productRepo.findById.mockResolvedValueOnce({
        enterpriseId: 'store1',
        sku: 'oldsku',
      });
      productRepo.findBySku.mockResolvedValueOnce({
        id: 'otherId',
      });

      await expect(
        service.update('id', {
          sku: 'newsku',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if category enterpriseId mismatch', async () => {
      productRepo.findById.mockResolvedValueOnce({
        enterpriseId: 'store1',
        sku: 'oldsku',
        category: { id: 'cid' },
      });
      productRepo.findBySku.mockResolvedValueOnce(null);
      categoryRepo.findById.mockResolvedValueOnce({
        enterpriseId: 'different',
      });

      await expect(
        service.update('id', {
          categoryId: 'cid',
        }),
      ).rejects.toThrow('Category does not exist');
    });

    it('should update successfully', async () => {
      productRepo.findById.mockResolvedValueOnce({
        enterpriseId: 'store1',
        sku: 'oldsku',
        category: { id: 'cid' },
      } as any);
      productRepo.findBySku.mockResolvedValueOnce(null);
      categoryRepo.findByIdOrThrow.mockResolvedValueOnce({
        enterpriseId: 'store1',
      } as any);

      productRepo.update.mockResolvedValueOnce({ success: true } as any);
      const result = await service.update('id', {});
      expect(result).toEqual({ success: true });
    });
  });

  describe('delete', () => {
    it('should throw if product not found', async () => {
      productRepo.findById.mockResolvedValue(null);
      await expect(service.delete('badid')).rejects.toThrow(NotFoundException);
    });

    it('should throw if product already deleted', async () => {
      productRepo.findById.mockResolvedValueOnce({
        deletedAt: new Date(),
      } as any);
      await expect(service.delete('id')).rejects.toThrow(BadRequestException);
    });

    it('should delete successfully', async () => {
      productRepo.findById.mockResolvedValueOnce({} as any);
      productRepo.softDelete.mockResolvedValueOnce({ success: true } as any);
      const result = await service.delete('id');
      expect(result).toEqual({ success: true });
    });
  });
});
