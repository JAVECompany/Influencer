import { Radio } from 'lucide-react'
import { contentKindLabels } from '../../constants/contentKinds'
import { panel } from '../../styles/controlStyles'
import type { IAccount, ICreator } from '../../types/account'
import type { IContent } from '../../types/content'
import Avatar from '../ui/media/Avatar'

export default function StoryRail({
  stories,
  onOpen,
  creators,
  accounts,
}: {
  stories: IContent[]
  onOpen: (id: string) => void
  creators: Record<string, ICreator>
  accounts: Record<string, IAccount>
}) {
  return (
    <section className="mb-7" aria-labelledby="stories-heading">
      <h2 id="stories-heading" className="mb-3 flex items-center gap-2 text-sm font-black">
        <Radio size={17} className="text-accent" /> 라이브 · 스토리
      </h2>
      {stories.length === 0 ? (
        <p className={`${panel} p-4 text-sm text-muted`}>현재 열 수 있는 스토리와 라이브가 없어요.</p>
      ) : (
        <div className={`${panel} flex gap-4 overflow-x-auto px-4 py-4 sm:gap-6 sm:px-5`}>
          {stories.map((post) => {
            const creator = creators[post.owner]
            return (
              <button
                type="button"
                key={post.id}
                aria-label={creator.name + ' ' + contentKindLabels[post.kind]}
                onClick={() => onOpen(post.id)}
                className="group grid w-[69px] shrink-0 justify-items-center gap-2.5"
              >
                <span
                  className={`relative grid size-[66px] place-items-center rounded-full p-0.5 transition group-hover:scale-105 ${
                    post.kind === 'live'
                      ? 'bg-linear-to-tr from-live to-live/55'
                      : 'bg-linear-to-tr from-accent/45 to-accent'
                  }`}
                >
                  <Avatar
                    person={creator}
                    account={accounts[creator.id]}
                    className="size-[60px] border-[3px] border-canvas"
                  />
                  {post.kind === 'live' && (
                    <span className="absolute -bottom-1 rounded-md border-2 border-surface bg-live text-on-live px-1.5 py-px text-[9px] font-black">
                      LIVE
                    </span>
                  )}
                </span>
                <span className="w-full truncate text-xs font-semibold">{creator.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
