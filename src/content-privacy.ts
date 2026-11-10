import { createContext, useEffect, useState } from 'react'

export const ContentPrivacy = createContext<'print' | 'inactive' | null>(null)
const isInactive = () => document.hidden || !document.hasFocus()

export function usePagePrivacyMask() {
  const [masked, setMasked] = useState(isInactive)

  useEffect(() => {
    const hide = () => setMasked(true)
    const sync = () => setMasked(isInactive())
    window.addEventListener('blur', hide)
    window.addEventListener('focus', sync)
    window.addEventListener('pagehide', hide)
    window.addEventListener('pageshow', sync)
    document.addEventListener('visibilitychange', sync)
    sync()
    return () => {
      window.removeEventListener('blur', hide)
      window.removeEventListener('focus', sync)
      window.removeEventListener('pagehide', hide)
      window.removeEventListener('pageshow', sync)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return masked
}

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
