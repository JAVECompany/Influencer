import Button from '../actions/Button'
import Modal from './Modal'

export default function ConfirmActionDialog({
  title,
  description,
  actionLabel,
  onConfirm,
  onClose,
}: {
  title: string
  description: string
  actionLabel: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="mb-4 text-sm text-muted">{description}</p>
      <Button className="w-full" tone="danger" onClick={onConfirm}>
        {actionLabel}
      </Button>
    </Modal>
  )
}
