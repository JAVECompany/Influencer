import { FileText } from 'lucide-react'
import ContentPreviewDialog from '../../../shared/components/content/ContentPreviewDialog'
import Button from '../../../shared/components/ui/actions/Button'
import ConfirmActionDialog from '../../../shared/components/ui/dialogs/ConfirmActionDialog'
import PageTitle from '../../../shared/components/ui/layout/PageTitle'
import type { OperatorProps } from '../../../shared/types/navigation'
import ContentAudienceDialog from '../components/ContentAudienceDialog'
import CreatorSettingsDialog from '../components/CreatorSettingsDialog'
import PublishContentDialog from '../components/PublishContentDialog'
import StudioContentList from '../components/StudioContentList'
import StudioOverview from '../components/StudioOverview'
import { useCreatorStudio } from '../hooks/useCreatorStudio'

export default function CreatorStudioScreen({ account, notify }: OperatorProps) {
  const {
    dialog,
    setDialog,
    preview,
    previewPost,
    setPreview,
    setAudienceId,
    creator,
    posts,
    audiencePost,
    viewers,
    subscribers,
    closeDialog,
    publish,
    saveSettings,
    removePost,
  } = useCreatorStudio({ account, notify })

  return (
    <>
      <PageTitle title="스튜디오">
        <Button onClick={() => setDialog('publish')}>
          <FileText size={17} /> 콘텐츠 등록
        </Button>
      </PageTitle>
      <StudioOverview
        creator={creator}
        subscribers={subscribers}
        postCount={posts.length}
        onEdit={() => setDialog('settings')}
      />
      <StudioContentList
        posts={posts}
        onAudience={setAudienceId}
        onPreview={setPreview}
        onDelete={setDialog}
      />
      {preview && (
        <ContentPreviewDialog post={previewPost} account={account} onClose={() => setPreview(null)} />
      )}
      {audiencePost && (
        <ContentAudienceDialog post={audiencePost} viewers={viewers} onClose={() => setAudienceId(null)} />
      )}
      {dialog === 'publish' && (
        <PublishContentDialog onPublish={publish} notify={notify} onClose={closeDialog} />
      )}
      {dialog === 'settings' && (
        <CreatorSettingsDialog creator={creator} onSave={saveSettings} onClose={closeDialog} />
      )}
      {dialog && typeof dialog === 'object' && (
        <ConfirmActionDialog
          title="콘텐츠 삭제"
          description={dialog.title + ' 콘텐츠를 삭제할까요?'}
          actionLabel="삭제"
          onConfirm={() => removePost(dialog.id)}
          onClose={closeDialog}
        />
      )}
    </>
  )
}
