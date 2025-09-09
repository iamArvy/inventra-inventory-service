export const mockProductRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdOrThrow: jest.fn(),
  findByIdWithRelationships: jest.fn(),
  findByStoreIdAndSku: jest.fn(),
  list: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  count: jest.fn(),
});
