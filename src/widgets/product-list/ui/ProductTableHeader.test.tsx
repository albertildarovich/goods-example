import { userEvent } from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/features/auth/model/store';

import { render, screen } from '@/test/test-utils';

import { ProductTableHeader } from './ProductTableHeader';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProductTableHeader', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      logout: mockLogout,
    });
  });

  it('renders title and search input', () => {
    render(
      <ProductTableHeader search="" onSearchChange={() => {}} />
    );

    expect(screen.getByText('Товары')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Найти')).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in search', async () => {
    const user = userEvent.setup();
    const onSearchChange = vi.fn();

    render(
      <ProductTableHeader search="" onSearchChange={onSearchChange} />
    );

    const input = screen.getByPlaceholderText('Найти');
    await user.type(input, 'x');

    expect(onSearchChange).toHaveBeenCalledWith('x');
  });

  it('displays search value', () => {
    render(
      <ProductTableHeader search="laptop" onSearchChange={() => {}} />
    );

    expect(screen.getByDisplayValue('laptop')).toBeInTheDocument();
  });

  it('calls logout and navigates to /login when logout button clicked', async () => {
    const user = userEvent.setup();

    render(
      <ProductTableHeader search="" onSearchChange={() => {}} />
    );

    const logoutBtn = screen.getByRole('button');
    await user.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
