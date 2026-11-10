import { ArrowLeft } from 'lucide-react'
import Button from './Button'

export default function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button tone="plain" className="mb-3 -ml-2" onClick={onClick}>
      <ArrowLeft size={17} /> 뒤로
    </Button>
  )
}
