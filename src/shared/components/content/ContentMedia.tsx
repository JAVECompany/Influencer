import type { Content } from '../../types/content'
import DemoScene from '../ui/DemoScene'

export default function ContentMedia({ post }: { post: Content }) {
  return post.media ? (
    <img src={post.media} alt={post.title} draggable={false} className="aspect-video w-full object-cover" />
  ) : (
    <DemoScene art={post.art} className="aspect-video w-full" />
  )
}
