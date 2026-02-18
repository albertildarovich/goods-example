import { LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Input, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { CartButton } from '@/features/cart/ui/CartButton';
import { useAuthStore } from '@/features/auth/model/store';
import { localeRu } from '@/shared/locale';

import styles from './ProductTableHeader.module.scss';

const L = localeRu.products;

interface ProductTableHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function ProductTableHeader({ search, onSearchChange }: ProductTableHeaderProps) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <Card className={styles.headerCard}>
      <Flex className={styles.header} align="center">
        <Typography.Title level={3} className={styles.title}>
          {L.title}
        </Typography.Title>
        <div className={styles.headerSpacer} />
        <div className={styles.searchWrapper}>
          <Input
            prefix={<SearchOutlined className={styles.searchIcon} />}
            placeholder={L.searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            allowClear
          />
        </div>
        <div className={styles.headerSpacer} />
        <CartButton />
        <Button
          type="primary"
          ghost
          icon={<LogoutOutlined />}
          onClick={() => {
            logout();
            navigate('/login', { replace: true });
          }}
        />
      </Flex>
    </Card>
  );
}
