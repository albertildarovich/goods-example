import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Checkbox, Divider, Form, Input, message, Typography } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import closeIconSrc from '@/assets/Close.svg';
import logoSrc from '@/assets/Logo.svg';
import lockIconSrc from '@/assets/lock-03.svg';
import userIconSrc from '@/assets/user icon.svg';
import { login } from '@/features/auth/api/login';
import { useAuthStore } from '@/features/auth/model/store';
import { localeRu } from '@/shared/locale';

import styles from './LoginForm.module.scss';

const L = localeRu.login;

export function LoginForm() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSession = useAuthStore((s) => s.setSession);
  const rememberMe = useAuthStore((s) => s.rememberMe);
  const setRememberMe = useAuthStore((s) => s.setRememberMe);

  const onFinish = async (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login({
        username: values.username,
        password: values.password,
      });
      setSession(data, !!values.remember);
      message.success(L.successMessage);
      navigate('/', { replace: true });
    } catch (err) {
      const msg = (err as Error)?.message ?? L.errorMessage;
      setError(msg);
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContent}>
      <header className={styles.header}>
        <img src={logoSrc} alt="" className={styles.logo} />
        <Typography.Title className={styles.title}>{L.welcome}</Typography.Title>
        <Typography.Text className={styles.subtitle}>{L.subtitle}</Typography.Text>
      </header>

      <div className={styles.formWrapper}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ remember: rememberMe }}
        >
          <Form.Item
            name="username"
            label={L.username}
            required={false}
            rules={[{ required: true, message: L.usernameRequired }]}
          >
            <Input
              prefix={<img src={userIconSrc} alt="" className={styles.inputIcon} />}
              placeholder={L.usernamePlaceholder}
              allowClear={{ clearIcon: <img src={closeIconSrc} alt="" className={styles.clearIcon} /> }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={L.password}
            required={false}
            rules={[{ required: true, message: L.passwordRequired }]}
          >
            <Input.Password
              size='large'
              prefix={<img src={lockIconSrc} alt="" className={styles.inputIcon} />}
              placeholder={L.passwordPlaceholder}
              iconRender={(visible) =>
                visible ? (
                  <span className={styles.visibilityIconWrapper}>
                    <EyeOutlined />
                  </span>
                ) : (
                  <span className={styles.visibilityIconWrapper}>
                    <EyeInvisibleOutlined />
                  </span>
                )
              }
            />
          </Form.Item>

          {error && <div className={styles.error}>{error}</div>}

          <Form.Item name="remember" valuePropName="checked" className={styles.rememberItem}>
            <Checkbox
              onChange={(e) => setRememberMe(e.target.checked)}
              classNames={{ icon: styles.checkboxIcon }}
            >
              {L.rememberMe}
            </Checkbox>
          </Form.Item>

          <Form.Item className={styles.submitItem}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              className={styles.submitBtn}
            >
              {L.submit}
            </Button>
          </Form.Item>

          <Divider className={styles.separator}>{L.divider}</Divider>

          <div className={styles.footer}>
            <Typography.Text className={styles.footerText}>{L.noAccount}</Typography.Text>
            <Typography.Link
              href="#"
              className={styles.footerLink}
              onClick={(e) => e.preventDefault()}
            >
              {L.createAccount}
            </Typography.Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
