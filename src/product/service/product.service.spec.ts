import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { mockProductRepository, ProductRepository } from '../repository';
import { CategoryRepository } from 'src/category/repository/category.repository';
import { BadRequestException, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { SortOrder } from 'src/common/dto';
import { ProductDto, ProductSortBy } from '../dto';
import { ProductDocument } from '../schema';
import { mockCategoryRepository } from 'src/category/repository';
import { mockProductEvent, ProductEvent } from '../event';

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
        {
          provide: ProductEvent,
          useFactory: mockProductEvent,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepo = module.get(ProductRepository);
    categoryRepo = module.get(CategoryRepository);

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  describe('create', () => {
    it('should throw if SKU already exists', async () => {
      productRepo.findByStoreIdAndSku.mockResolvedValueOnce({
        id: 'id',
      } as Partial<ProductDocument>);
      await expect(
        service.create({
          storeId: 'store1',
          categoryId: 'cat1',
          sku: 'sku123',
          name: 'Prod',
          price: 100,
          stock: 5,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if category does not exist or storeId mismatch', async () => {
      productRepo.findByStoreIdAndSku.mockResolvedValueOnce(null);
      categoryRepo.findById.mockResolvedValueOnce(null);

      await expect(
        service.create({
          storeId: 'store1',
          categoryId: 'cat1',
          sku: 'sku123',
          name: 'Prod',
          price: 100,
          stock: 5,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create product if validation passes', async () => {
      productRepo.findByStoreIdAndSku.mockResolvedValueOnce(null);
      categoryRepo.findById.mockResolvedValueOnce({
        _id: 'id',
        storeId: 'store1',
      });
      productRepo.create.mockResolvedValueOnce({ _id: 'prod1' });

      const result = await service.create({
        storeId: 'store1',
        categoryId: 'cat1',
        sku: 'sku123',
        name: 'Prod',
        price: 100,
        stock: 5,
      });

      expect(result).toBeInstanceOf(ProductDto);
      expect(productRepo.create).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should throw if id is invalid', async () => {
      productRepo.findByIdWithRelationships.mockRejectedValueOnce(
        new BadRequestException(),
      );
      await expect(service.get('invalid')).rejects.toThrow(BadRequestException);
    });

    it('should return product if id is valid', async () => {
      const product = { _id: 'p1' };
      productRepo.findByIdWithRelationships.mockResolvedValueOnce(
        product as any,
      );
      const result = await service.get('id');
      expect(result).toBeInstanceOf(ProductDto);
    });
  });

  describe('list', () => {
    it('should call repo.list with filters and options', async () => {
      productRepo.list.mockResolvedValueOnce({ docs: [], totalDocs: 0 });
      await service.list({
        sortBy: ProductSortBy.NAME,
        order: SortOrder.ASC,
        minPrice: 10,
        maxPrice: 100,
      });
      expect(productRepo.list).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should throw if id is invalid', async () => {
      await expect(service.update('badid', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if product is deleted', async () => {
      productRepo.findByIdWithRelationships.mockResolvedValueOnce({
        deletedAt: new Date(),
      });
      await expect(
        service.update(new Types.ObjectId().toString(), {}),
      ).rejects.toThrow('Product already deleted');
    });

    it('should throw if SKU is taken by another product', async () => {
      productRepo.findByIdWithRelationships.mockResolvedValueOnce({
        storeId: 'store1',
        sku: 'oldsku',
      });
      productRepo.findByStoreIdAndSku.mockResolvedValueOnce({
        id: 'otherId',
      });

      await expect(
        service.update(new Types.ObjectId().toString(), {
          sku: 'newsku',
        }),
      ).rejects.toThrow('Product with this SKU already exists');
    });

    it('should throw if category storeId mismatch', async () => {
      productRepo.findByIdWithRelationships.mockResolvedValueOnce({
        storeId: 'store1',
        sku: 'oldsku',
        category: { _id: new Types.ObjectId() },
      } as any);
      productRepo.findByStoreIdAndSku.mockResolvedValueOnce(null);
      categoryRepo.findByIdOrThrow.mockResolvedValueOnce({
        storeId: 'different',
      } as any);

      await expect(
        service.update(new Types.ObjectId().toString(), {
          categoryId: new Types.ObjectId().toString(),
        }),
      ).rejects.toThrow('Category does not exist');
    });

    it('should update successfully', async () => {
      productRepo.findByIdWithRelationships.mockResolvedValueOnce({
        storeId: 'store1',
        sku: 'oldsku',
        category: { _id: new Types.ObjectId() },
      } as any);
      productRepo.findByStoreIdAndSku.mockResolvedValueOnce(null);
      categoryRepo.findByIdOrThrow.mockResolvedValueOnce({
        storeId: 'store1',
      } as any);

      productRepo.update.mockResolvedValueOnce({ success: true } as any);
      const result = await service.update(new Types.ObjectId().toString(), {});
      expect(result).toEqual({ success: true });
    });
  });

  describe('delete', () => {
    it('should throw if id is invalid', async () => {
      await expect(service.delete('badid')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw if product already deleted', async () => {
      productRepo.findByIdOrThrow.mockResolvedValueOnce({
        deletedAt: new Date(),
      } as any);
      await expect(
        service.delete(new Types.ObjectId().toString()),
      ).rejects.toThrow('Product already deleted');
    });

    it('should delete successfully', async () => {
      productRepo.findByIdOrThrow.mockResolvedValueOnce({} as any);
      productRepo.softDelete.mockResolvedValueOnce({ success: true } as any);
      const result = await service.delete(new Types.ObjectId().toString());
      expect(result).toEqual({ success: true });
    });
  });
});
