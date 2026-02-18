import { EllipsisOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Pagination, Space, Spin, Table, Typography } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import arrowsIconSrc from '@/assets/ArrowsClockwise.svg';
import { useCartStore } from '@/entities/cart/model/store';
import { getProducts } from '@/entities/product/api/products';
import type { Product } from '@/entities/product/model/types';
import { AddProductModal } from '@/features/add-product/ui/AddProductModal';
import { localeRu } from '@/shared/locale';
import { useProductsUIStore } from '../model/store';

import { ProductTableHeader } from './ProductTableHeader';
import styles from './ProductTable.module.scss';

function ProductRowActions({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <Space>
      <Button
        type="primary"
        size="small"
        className={styles.addRowBtn}
        icon={<PlusOutlined />}
        onClick={() => addItem(product)}
      />
      <Button size="small" className={styles.moreBtn} icon={<EllipsisOutlined />} />
    </Space>
  );
}

const ROW_HEIGHT = 75;
const TABLE_HEADER_HEIGHT = 55;
const PAGINATION_HEIGHT = 52;
const L = localeRu.products;
const LEGACY_SORT_MAP: Record<string, string> = {
  [L.columns.title]: 'title',
  [L.columns.brand]: 'brand',
  [L.columns.sku]: 'sku',
  [L.columns.rating]: 'rating',
  [L.columns.price]: 'price',
};


export function ProductTable() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const { sortBy, order, page, search, setSort, setPage, setSearch } =
    useProductsUIStore();

  useEffect(() => {
    const el = tableWrapperRef.current;
    if (!el) return;
    let rafId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const observer = new ResizeObserver((entries) => {
      const { height } = entries[0]?.contentRect ?? {};
      if (height <= 0) return;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        rafId = requestAnimationFrame(() => {
          const available = height - TABLE_HEADER_HEIGHT - PAGINATION_HEIGHT;
          const rows = Math.max(1, Math.floor(available / ROW_HEIGHT));
          setPageSize((prev) => (prev !== rows ? rows : prev));
        });
      }, 150);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, []);

  const apiSortBy = LEGACY_SORT_MAP[sortBy] ?? sortBy;
  const sortOrderAnt: 'ascend' | 'descend' | null =
    order === 'asc' ? 'ascend' : order === 'desc' ? 'descend' : null;

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['products', page, pageSize, apiSortBy, order, search],
    queryFn: () =>
      getProducts({
        limit: pageSize,
        skip: (page - 1) * pageSize,
        sortBy: apiSortBy,
        order,
        q: search || undefined,
      }),
  });

  const products = data?.products ?? [];
  const total = data?.total ?? 0;

  const handleSort = useCallback(
    (columnKey: string) => {
      const apiField = LEGACY_SORT_MAP[columnKey] ?? columnKey;
      if (apiField === apiSortBy) {
        setSort(columnKey, order === 'asc' ? 'desc' : 'asc');
      } else {
        setSort(columnKey, 'asc');
      }
    },
    [apiSortBy, order, setSort]
  );

  const handleTableChange = useCallback(
    (_: unknown, __: unknown, sorter: unknown) => {
      if (
        sorter &&
        !Array.isArray(sorter) &&
        typeof sorter === 'object' &&
        'columnKey' in sorter
      ) {
        handleSort(sorter.columnKey as string);
      }
    },
    [handleSort]
  );

  const columns = useMemo(
    () => [
    {
      title: L.columns.title,
      dataIndex: 'title',
      key: 'title',
      sorter: true,
      sortOrder: apiSortBy === 'title' ? sortOrderAnt : null,
      render: (_: unknown, record: Product) => (
        <Flex align="center" gap={8} className={styles.productCell}>
          <div className={styles.thumbnailWrap}>
            {record.thumbnail && (
              <img src={record.thumbnail} alt="" className={styles.thumbnail} />
            )}
          </div>
          <Space direction="vertical" size={0} className={styles.productText}>
            <Typography.Text className={styles.productTitle} strong ellipsis>
              {record.title}
            </Typography.Text>
            <Typography.Text
              className={styles.productCategory}
              type="secondary"
              ellipsis
            >
              {record.category}
            </Typography.Text>
          </Space>
        </Flex>
      ),
    },
    {
      title: L.columns.brand,
      dataIndex: 'brand',
      key: 'brand',
      width: 280,
      align: 'center' as const,
      sorter: true,
      sortOrder: apiSortBy === 'brand' ? sortOrderAnt : null,
      ellipsis: true,
      className: styles.brandColumn,
    },
    {
      title: L.columns.sku,
      dataIndex: 'sku',
      key: 'sku',
      width: 280,
      align: 'center' as const,
      sorter: true,
      sortOrder: apiSortBy === 'sku' ? sortOrderAnt : null,
      ellipsis: true,
    },
    {
      title: L.columns.rating,
      dataIndex: 'rating',
      key: 'rating',
      width: 280,
      align: 'center' as const,
      sorter: true,
      sortOrder: apiSortBy === 'rating' ? sortOrderAnt : null,
      render: (rating: number) => (
        <>
          {rating < 3 ? (
            <Typography.Text type="danger">{rating}</Typography.Text>
          ) : (
            rating
          )}
          /5
        </>
      ),
    },
    {
      title: L.columns.price,
      dataIndex: 'price',
      key: 'price',
      width: 280,
      align: 'center' as const,
      sorter: true,
      sortOrder: apiSortBy === 'price' ? sortOrderAnt : null,
      render: (price: number) => {
        const formatted = new Intl.NumberFormat('ru-RU', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price);
        const [intPart, decPart] = formatted.split(',');
        return (
          <span className={styles.priceCell}>
            {intPart},
            <span className={styles.priceDecimals}>{decPart}</span>
          </span>
        );
      },
    },
    {
      title: '',
      key: 'actions',
      width: 280,
      align: 'center' as const,
      render: (_: unknown, record: Product) => (
        <ProductRowActions product={record} />
      ),
    },
  ],
    [apiSortBy, sortOrderAnt]
  );

  const totalPages = Math.ceil(total / pageSize);

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    columnWidth: 40,
  };

  return (
    <div className={styles.root}>
      <ProductTableHeader search={search} onSearchChange={setSearch} />

      <div className={styles.separator}>
        <Card className={styles.card}>
          <Flex justify="space-between" align="center" className={styles.cardHeader}>
            <Typography.Text className={styles.tableTitle}>{L.allItems}</Typography.Text>
            <Space size={12}>
              <Button
                className={styles.reloadBtn}
                icon={<img src={arrowsIconSrc} alt="" aria-hidden />}
                onClick={() => refetch()}
              />
              <Button
                type="primary"
                className={styles.addBtn}
                icon={<PlusCircleOutlined />}
                onClick={() => setAddModalOpen(true)}
              >
                {L.add}
              </Button>
            </Space>
          </Flex>

          <div ref={tableWrapperRef} className={styles.tableWrapper}>
            {(isLoading || isFetching) && (
              <div className={styles.loaderOverlay}>
                <Spin size="large" />
              </div>
            )}
            <Table
              rowKey="id"
              dataSource={products}
              columns={columns}
              rowSelection={rowSelection}
              pagination={false}
              onChange={handleTableChange}
            />
          </div>

          <Flex
            justify="space-between"
            align="center"
            className={styles.pagination}
          >
            <span className={styles.paginationInfo}>
              {L.paginationShown}{' '}
              <span className={styles.paginationNumbers}>
                {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)}
              </span>{' '}
              {L.paginationOf}{' '}
              <span className={styles.paginationNumbers}>{total}</span>
            </span>
            <Pagination
              current={page}
              total={total}
              pageSize={pageSize}
              showSizeChanger={false}
              hideOnSinglePage={totalPages <= 1}
              showPrevNextJumpers={false}
              onChange={(p) => setPage(p)}
            />
          </Flex>
        </Card>
      </div>

      <AddProductModal open={addModalOpen} onClose={() => setAddModalOpen(false)} />
    </div>
  );
}
