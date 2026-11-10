import { MessageCircle } from 'lucide-react'
import EmptyState from '../../../shared/components/ui/EmptyState'
import PageTitle from '../../../shared/components/ui/PageTitle'
import type { PageProps } from '../../../shared/types/navigation'
import ChatPartnerList from '../components/ChatPartnerList'
import ChatThread from '../components/ChatThread'
import { useChat } from '../hooks/useChat'

export default function ChatScreen({
  account,
  initial,
  notify,
}: Pick<PageProps, 'account' | 'initial' | 'notify'>) {
  const {
    accounts,
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
  } = useChat({ account, initial, notify })
  return (
    <>
      <PageTitle
        label="INBOX"
        title="채팅"
        subtitle={
          customerView ? '구독 중인 크리에이터와 이야기를 나눠 보세요.' : '구독자가 보낸 메시지를 확인하세요.'
        }
      />
      {!ids.length ? (
        <EmptyState icon={MessageCircle} title="아직 대화 상대가 없어요" />
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-[210px_minmax(0,1fr)]">
          <ChatPartnerList
            ids={ids}
            thread={thread}
            other={other}
            accounts={accounts}
            onSelect={selectThread}
          />
          {thread ? (
            <ChatThread
              name={other(thread)?.name ?? thread}
              accountId={account.id}
              messages={messages}
              log={log}
              text={text}
              onChange={setText}
              onBack={closeThread}
              onSend={sendMessage}
            />
          ) : (
            <div className="hidden md:block">
              <EmptyState icon={MessageCircle} title="대화를 선택해 주세요" />
            </div>
          )}
        </div>
      )}
    </>
  )
}
