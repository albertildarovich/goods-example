import { Form, Input, InputNumber, message, Modal } from 'antd';

import { localeRu } from '@/shared/locale';

import styles from './AddProductModal.module.scss';

const L = localeRu.addProduct;

interface AddProductFormValues {
  title: string;
  price: number;
  brand: string;
  sku: string;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddProductModal({ open, onClose }: AddProductModalProps) {
  const [form] = Form.useForm<AddProductFormValues>();

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      message.success(L.successMessage);
      form.resetFields();
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={L.modalTitle}
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      okText={L.okText}
      cancelText={L.cancelText}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label={L.fields.title}
          rules={[{ required: true, message: L.fields.titleRequired }]}
        >
          <Input placeholder={L.fields.titlePlaceholder} />
        </Form.Item>

        <Form.Item
          name="price"
          label={L.fields.price}
          rules={[{ required: true, message: L.fields.priceRequired }]}
        >
          <InputNumber
            className={styles.priceInput}
            placeholder={L.fields.pricePlaceholder}
            min={0}
            precision={2}
          />
        </Form.Item>

        <Form.Item
          name="brand"
          label={L.fields.brand}
          rules={[{ required: true, message: L.fields.brandRequired }]}
        >
          <Input placeholder={L.fields.brandPlaceholder} />
        </Form.Item>

        <Form.Item
          name="sku"
          label={L.fields.sku}
          rules={[{ required: true, message: L.fields.skuRequired }]}
        >
          <Input placeholder={L.fields.skuPlaceholder} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
