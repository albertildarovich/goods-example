import { beforeEach, describe, expect, it } from 'vitest';

import { useProductsUIStore } from './store';

describe('useProductsUIStore', () => {
  beforeEach(() => {
    const store = useProductsUIStore.getState();
    store.setSort('title', 'asc');
    store.setPage(1);
    store.setSearch('');
  });

  it('has default values', () => {
    const { sortBy, order, page, search } = useProductsUIStore.getState();
    expect(sortBy).toBe('title');
    expect(order).toBe('asc');
    expect(page).toBe(1);
    expect(search).toBe('');
  });

  it('setSort updates sort and resets page', () => {
    const store = useProductsUIStore.getState();
    store.setPage(3);
    store.setSort('price', 'desc');

    const state = useProductsUIStore.getState();
    expect(state.sortBy).toBe('price');
    expect(state.order).toBe('desc');
    expect(state.page).toBe(1);
  });

  it('setPage updates page', () => {
    const store = useProductsUIStore.getState();
    store.setPage(5);

    expect(useProductsUIStore.getState().page).toBe(5);
  });

  it('setSearch updates search and resets page', () => {
    const store = useProductsUIStore.getState();
    store.setPage(3);
    store.setSearch('laptop');

    const state = useProductsUIStore.getState();
    expect(state.search).toBe('laptop');
    expect(state.page).toBe(1);
  });
});
