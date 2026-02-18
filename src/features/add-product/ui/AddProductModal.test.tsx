import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/test/test-utils';

import { AddProductModal } from './AddProductModal';

describe('AddProductModal', () => {
  it('renders nothing when closed', () => {
    render(<AddProductModal open={false} onClose={() => {}} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders modal with form when open', () => {
    render(<AddProductModal open onClose={() => {}} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Добавить товар')).toBeInTheDocument();
    expect(screen.getByLabelText('Наименование')).toBeInTheDocument();
    expect(screen.getByLabelText('Цена, Р')).toBeInTheDocument();
    expect(screen.getByLabelText('Вендор')).toBeInTheDocument();
    expect(screen.getByLabelText('Артикул')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Добавить' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });

  it('calls onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<AddProductModal open onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Отмена' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();

    render(<AddProductModal open onClose={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    const titleInput = screen.getByLabelText('Наименование');
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<AddProductModal open onClose={onClose} />);

    await user.type(screen.getByPlaceholderText('Название товара'), 'Test Product');
    await user.type(screen.getByPlaceholderText('0'), '99.99');
    await user.type(screen.getByPlaceholderText('Бренд / вендор'), 'Test Brand');
    await user.type(screen.getByPlaceholderText('Артикул'), 'SKU-123');

    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(onClose).toHaveBeenCalled();
  });
});
