import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  loading = false,
  variant = 'danger',
}) => (
  <div className="confirm-dialog">
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ textAlign: 'center' }}>
        <div className="confirm-dialog-icon danger">
          <AlertTriangle size={24} />
        </div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{message}</p>
      </div>
    </Modal>
  </div>
);

export default ConfirmDialog;
