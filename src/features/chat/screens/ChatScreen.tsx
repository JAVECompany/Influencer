import { MessageCircle } from 'lucide-react'
import EmptyState from '../../../shared/components/ui/feedback/EmptyState'
import PageTitle from '../../../shared/components/ui/layout/PageTitle'
import type { IPageProps } from '../../../shared/types/navigation'
import ChatPartnerList from '../components/ChatPartnerList'
import ChatThread from '../components/ChatThread'
import { useChat } from '../hooks/useChat'

export default function ChatScreen({
  account,
  initial,
  notify,
}: Pick<IPageProps, 'account' | 'initial' | 'notify'>) {
  const {
    accounts,
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
  } = useChat({ account, initial, notify })
  return (
    <>
      <PageTitle
        title="채팅"
        subtitle={
          customerView
            ? '구독 중인 크리에이터와 이야기를 나눠 보세요.'
            : '현재 내 콘텐츠를 구독 중인 고객에게만 메시지를 보낼 수 있어요.'
        }
      />
      {!ids.length ? (
        <EmptyState icon={MessageCircle} title="아직 대화 상대가 없어요" />
      ) : (
        <div className="grid items-start gap-4 md:grid-cols-[210px_minmax(0,1fr)]">
          <ChatPartnerList
            ids={ids}
            thread={thread}
            getChatPartner={getChatPartner}
            accounts={accounts}
            onSelect={selectThread}
          />
          {thread ? (
            <ChatThread
              name={getChatPartner(thread)?.name ?? thread}
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
