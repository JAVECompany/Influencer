import { useEffect, useRef, useState } from 'react'
import {
  hasSubscription,
  getCustomerSubscriptions,
} from '../../../shared/utils/subscription/subscriptionAccess'
import { useAccountStore } from '../../../shared/store/account/account'
import { useChatStore } from '../../../shared/store/chat/chat'
import { useCreatorStore } from '../../../shared/store/creator/creator'
import { useSubscriptionStore } from '../../../shared/store/subscription/subscription'
import type { IPageProps } from '../../../shared/types/navigation'

export function useChat({ account, initial, notify }: Pick<IPageProps, 'account' | 'initial' | 'notify'>) {
  const accounts = useAccountStore((s) => s.accounts)
  const creators = useCreatorStore((s) => s.creators)
  const subscriptions = useSubscriptionStore((s) => s.subscriptions)
  const allMessages = useChatStore((s) => s.messages)
  const state = { accounts, creators, subscriptions }
  const sendChatMessage = useChatStore((s) => s.sendMessage)
  const [selected, setSelected] = useState(initial ?? null)
  const [text, setText] = useState('')
  const customerView = account.role === 'customer'
  const ids = customerView
    ? getCustomerSubscriptions(state, account.id).filter((id) => hasSubscription(state, account.id, id))
    : account.role === 'influencer'
    ? Object.keys(state.subscriptions).filter((id) => hasSubscription(state, id, account.id))
    : []
  const getChatPartner = (id: string) => (customerView ? state.creators[id] : state.accounts[id])
  const thread = selected && ids.includes(selected) ? selected : null
  const messages = thread
    ? allMessages.filter((m) =>
        customerView
          ? m.customer === account.id && m.creator === thread
          : m.creator === account.id && m.customer === thread
      )
    : []
  const log = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (log.current) {
      log.current.scrollTop = log.current.scrollHeight
    }
  }, [thread, messages.length])
  const selectThread = (id: string) => {
    setSelected(id)
    setText('')
  }
  const closeThread = () => setSelected(null)
  const sendMessage = () => {
    if (!thread) {
      return
    }

    const result = sendChatMessage(thread, text)
    if (result.error) {
      notify(result)
    } else {
      setText('')
    }
  }

  return {
    accounts: state.accounts,
    customerView,
    ids,
    getChatPartner,
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
