import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type: 'alert' | 'confirm';
  confirmText?: string;
  cancelText?: string;
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type,
  confirmText = 'OK',
  cancelText = 'Cancel',
}: ModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-semibold text-[var(--color-text)] mb-3">
          {title}
        </h2>
        
        <p className="text-[var(--color-text-secondary)] mb-6 whitespace-pre-wrap">
          {message}
        </p>

        <div className="flex gap-3 justify-end">
          {type === 'confirm' && (
            <Button onClick={onClose} variant="outline">
              {cancelText}
            </Button>
          )}
          <Button onClick={handleConfirm} variant="primary">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
