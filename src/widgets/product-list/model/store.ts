import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const SORT_STORAGE_KEY = 'products_sort';

interface ProductsUIState {
  sortBy: string;
  order: 'asc' | 'desc';
  page: number;
  search: string;
  setSort: (sortBy: string, order: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
}

export const useProductsUIStore = create<ProductsUIState>()(
  persist(
    (set) => ({
      sortBy: 'title' as string,
      order: 'asc' as const,
      page: 1,
      search: '',
      setSort: (sortBy, order) => set({ sortBy, order, page: 1 }),
      setPage: (page) => set({ page }),
      setSearch: (search) => set({ search, page: 1 }),
    }),
    { name: SORT_STORAGE_KEY, partialize: (s) => ({ sortBy: s.sortBy, order: s.order }) }
  )
);
