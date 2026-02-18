import { ProductTable } from '@/widgets/product-list/ui/ProductTable';

import styles from './ProductsPage.module.scss';

export function ProductsPage() {
  return (
    <div className={styles.root}>
      <ProductTable />
    </div>
  );
}