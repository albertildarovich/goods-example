import { apiFetch } from '@/shared/api/client';

import type { ProductsResponse } from '../model/types';

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  q?: string;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
  const { limit = 20, skip = 0, sortBy, order, q } = params;

  if (q) {
    const data = await apiFetch<ProductsResponse>(
      `/products/search?q=${encodeURIComponent(q)}&limit=${limit}&skip=${skip}`
    );
    return data;
  }

  const searchParams = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  });
  if (sortBy) searchParams.set('sortBy', sortBy);
  if (order) searchParams.set('order', order);

  const data = await apiFetch<ProductsResponse>(`/products?${searchParams}`);
  return data;
}
