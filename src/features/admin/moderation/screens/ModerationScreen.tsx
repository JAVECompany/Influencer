import ContentPreviewDialog from '../../../../shared/components/content/ContentPreviewDialog'
import Button from '../../../../shared/components/ui/actions/Button'
import PageTitle from '../../../../shared/components/ui/layout/PageTitle'
import { panel } from '../../../../shared/styles/controlStyles'
import type { OperatorProps, PageProps } from '../../../../shared/types/navigation'
import ModerationAccountRow from '../components/ModerationAccountRow'
import ModerationContentRow from '../components/ModerationContentRow'
import { useModeration } from '../hooks/useModeration'

export default function ModerationScreen({
  account,
  notify,
  openCreator,
}: OperatorProps & Pick<PageProps, 'openCreator'>) {
  const {
    tab,
    setTab,
    preview,
    previewPost,
    setPreview,
    posts,
    managedAccounts,
    creators,
    togglePost,
    toggleAccount,
  } = useModeration(notify)
  return (
    <>
      <PageTitle title="운영 관리" />
      <div className="mb-4 flex gap-2">
        <Button
          tone={tab === 'content' ? 'primary' : 'subtle'}
          aria-pressed={tab === 'content'}
          onClick={() => setTab('content')}
        >
          콘텐츠
        </Button>
        <Button
          tone={tab === 'accounts' ? 'primary' : 'subtle'}
          aria-pressed={tab === 'accounts'}
          onClick={() => setTab('accounts')}
        >
          계정
        </Button>
      </div>
      <section className={`${panel} divide-y divide-line`}>
        {tab === 'content'
          ? posts.map((post) => (
              <ModerationContentRow
                key={post.id}
                post={post}
                ownerName={creators[post.owner]?.name ?? post.owner}
                openCreator={openCreator}
                onPreview={setPreview}
                onToggle={togglePost}
              />
            ))
          : managedAccounts.map(({ id, account, creator, disabled }) => (
              <ModerationAccountRow
                key={id}
                account={account}
                creator={creator}
                disabled={disabled}
                onToggle={() => toggleAccount(id)}
              />
            ))}
      </section>
      {preview && (
        <ContentPreviewDialog post={previewPost} account={account} onClose={() => setPreview(null)} />
      )}
    </>
  )
}
