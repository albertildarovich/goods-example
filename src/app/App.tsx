import { ConfigProvider, Spin } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/model/store';
import { LoginPage } from '@/pages/login/ui/LoginPage';
import { ProductsPage } from '@/pages/products/ui/ProductsPage';

import styles from './App.module.scss';
import { AuthProvider } from './providers/AuthProvider';
import { QueryProvider } from './providers/QueryProvider';
import { applyThemeVars, theme } from './theme';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) {
    return (
      <div className={styles.loadingWrap}>
        <Spin size="large" />
      </div>
    );
  }

  return accessToken ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  useEffect(() => {
    applyThemeVars();
  }, []);

  return (
    <ConfigProvider
      locale={ruRU}
      theme={theme}
    >
      <QueryProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryProvider>
    </ConfigProvider>
  );
}
