import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/features/auth/model/store';
import { LoginForm } from '@/widgets/login-form/ui/LoginForm';

import styles from './LoginPage.module.scss';

export function LoginPage() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  if (!isHydrated) return null;
  if (accessToken) return <Navigate to="/" replace />;
  return (
    <div className={styles.page}>
      <div className={styles.cardOuter}>
        <div className={styles.cardInner}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
