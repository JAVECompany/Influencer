import { useEffect, useState } from 'react'

export function usePrintPrivacyMask() {
  const [printing, setPrinting] = useState(false)

  useEffect(() => {
    const hide = () => setPrinting(true)
    const restore = () => setPrinting(false)
    window.addEventListener('beforeprint', hide)
    window.addEventListener('afterprint', restore)
    return () => {
      window.removeEventListener('beforeprint', hide)
      window.removeEventListener('afterprint', restore)
    }
  }, [])

  return printing
}
