import Modal from '../common/Modal';
import AdminButton from './AdminButton';

/**
 * The delete confirmation every admin page used to spell out in full.
 *
 * Built on the shared `Modal`, which already handles the focus trap, Escape and
 * restoring focus to the trigger — none of the hand-rolled dialogs did.
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  busy = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="mb-6 text-sm text-dark-500">{message}</p>
      <div className="flex gap-3">
        <AdminButton variant="ghost" onClick={onClose} className="flex-1" disabled={busy}>
          {cancelLabel}
        </AdminButton>
        <AdminButton variant="danger" onClick={onConfirm} className="flex-1" disabled={busy}>
          {confirmLabel}
        </AdminButton>
      </div>
    </Modal>
  );
}
