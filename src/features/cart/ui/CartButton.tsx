import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Button, Drawer, Flex, InputNumber, Space, Typography } from 'antd';
import { useState } from 'react';

import { useCartStore } from '@/entities/cart/model/store';
import { localeRu } from '@/shared/locale';

import styles from './CartButton.module.scss';

const L = localeRu.cart;

export function CartButton() {
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <>
      <Badge count={totalCount} size="small" className={styles.badge}>
        <Button
          type="primary"
          ghost
          icon={<ShoppingCartOutlined />}
          onClick={() => setOpen(true)}
          aria-label={L.title}
        />
      </Badge>
      <Drawer
        title={L.title}
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        width={400}
      >
        {items.length === 0 ? (
          <Typography.Text type="secondary">{L.empty}</Typography.Text>
        ) : (
          <div className={styles.cartList}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className={styles.cartItem}>
                <div className={styles.cartItemInfo}>
                  {product.thumbnail && (
                    <img
                      src={product.thumbnail}
                      alt=""
                      className={styles.cartItemThumb}
                    />
                  )}
                  <Flex vertical gap={4} className={styles.cartItemText}>
                    <Typography.Text strong ellipsis>
                      {product.title}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                      {new Intl.NumberFormat('ru-RU', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }).format(product.price)}{' '}
                      ₽
                    </Typography.Text>
                  </Flex>
                </div>
                <Space>
                  <InputNumber
                    min={1}
                    value={quantity}
                    onChange={(v) => updateQuantity(product.id, v ?? 1)}
                    size="small"
                    className={styles.quantityInput}
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={() => removeItem(product.id)}
                  >
                    {L.remove}
                  </Button>
                </Space>
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </>
  );
}
