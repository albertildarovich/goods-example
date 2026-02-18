import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getProducts } from './products';

vi.mock('@/shared/api/client', () => ({
  apiFetch: vi.fn(),
}));

const { apiFetch } = await import('@/shared/api/client');

describe('getProducts', () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it('fetches products with default params', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 20,
    };

    vi.mocked(apiFetch).mockResolvedValue(mockResponse);

    const result = await getProducts();

    expect(apiFetch).toHaveBeenCalledWith(
      '/products?limit=20&skip=0'
    );
    expect(result).toEqual(mockResponse);
  });

  it('fetches products with sort and order params', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 10,
    };

    vi.mocked(apiFetch).mockResolvedValue(mockResponse);

    await getProducts({
      limit: 10,
      skip: 10,
      sortBy: 'price',
      order: 'desc',
    });

    expect(apiFetch).toHaveBeenCalledWith(
      '/products?limit=10&skip=10&sortBy=price&order=desc'
    );
  });

  it('uses search endpoint when q is provided', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      skip: 0,
      limit: 20,
    };

    vi.mocked(apiFetch).mockResolvedValue(mockResponse);

    await getProducts({
      q: 'laptop',
      limit: 10,
      skip: 0,
    });

    expect(apiFetch).toHaveBeenCalledWith(
      '/products/search?q=laptop&limit=10&skip=0'
    );
  });

  it('encodes special characters in search query', async () => {
    vi.mocked(apiFetch).mockResolvedValue({
      products: [],
      total: 0,
      skip: 0,
      limit: 20,
    });

    await getProducts({
      q: 'test & query',
      limit: 20,
      skip: 0,
    });

    expect(apiFetch).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('test & query'))
    );
  });
});
