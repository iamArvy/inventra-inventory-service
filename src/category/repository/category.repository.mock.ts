export const mockCategoryRepository = () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdOrThrow: jest.fn(),
  findByIdWithRelationships: jest.fn(),
  findByName: jest.fn(),
  list: jest.fn(),
  createMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});
