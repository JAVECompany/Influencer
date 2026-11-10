import { useEffect, useRef, useState } from 'react'
import { hasSubscription } from '../../../shared/store/appSelectors'
import { useAppStore } from '../../../shared/store/useAppStore'
import type { PageProps } from '../../../shared/types/navigation'

export function useChat({ account, initial, notify }: Pick<PageProps, 'account' | 'initial' | 'notify'>) {
  const state = useAppStore()
  const [selected, setSelected] = useState(initial ?? null)
  const [text, setText] = useState('')
  const customerView = account.role === 'customer'
  const ids = customerView
    ? (state.subscriptions[account.id] ?? []).filter((id) => hasSubscription(state, account.id, id))
    : account.role === 'influencer'
    ? Object.keys(state.subscriptions).filter((id) => hasSubscription(state, id, account.id))
    : []
  const other = (id: string) => (customerView ? state.creators[id] : state.accounts[id])
  const thread = selected && ids.includes(selected) ? selected : null
  const messages = thread
    ? state.messages.filter((m) =>
        customerView
          ? m.customer === account.id && m.creator === thread
          : m.creator === account.id && m.customer === thread
      )
    : []
  const log = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (log.current) log.current.scrollTop = log.current.scrollHeight
  }, [thread, messages.length])
  const selectThread = (id: string) => {
    setSelected(id)
    setText('')
  }
  const closeThread = () => setSelected(null)
  const sendMessage = () => {
    if (!thread) return
    const result = state.sendMessage(thread, text)
    if (result.error) notify(result)
    else setText('')
  }

  return {
    accounts: state.accounts,
    customerView,
    ids,
    other,
    thread,
    messages,
    log,
    text,
    setText,
    selectThread,
    closeThread,
    sendMessage,
  }
}
