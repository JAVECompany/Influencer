import type { ComponentType } from 'react'
import {
  ClipboardCheck,
  Home as HomeIcon,
  LayoutDashboard,
  MessageCircle,
  Search,
  Shield,
  ShoppingBag,
  UserRound,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AdminDashboardScreen from '../../features/admin/dashboard/screens/AdminDashboardScreen'
import ModerationScreen from '../../features/admin/moderation/screens/ModerationScreen'
import CreatorReviewScreen from '../../features/admin/review/screens/CreatorReviewScreen'
import AdminSettlementScreen from '../../features/admin/settlement/screens/AdminSettlementScreen'
import ChatScreen from '../../features/chat/screens/ChatScreen'
import CoinStoreScreen from '../../features/coins/screens/CoinStoreScreen'
import CreatorApplicationScreen from '../../features/creator-application/screens/CreatorApplicationScreen'
import CreatorCatalogScreen from '../../features/creator-catalog/screens/CreatorCatalogScreen'
import CreatorEarningsScreen from '../../features/creator-earnings/screens/CreatorEarningsScreen'
import CreatorStudioScreen from '../../features/creator-studio/screens/CreatorStudioScreen'
import DiscoverScreen from '../../features/discover/screens/DiscoverScreen'
import HomeScreen from '../../features/home/screens/HomeScreen'
import ProfileScreen from '../../features/profile/screens/ProfileScreen'
import type { RoleType } from '../../shared/types/account'
import type { PageKeyType, IPageProps } from '../../shared/types/navigation'

type NavItemType = [PageKeyType, string, LucideIcon]

export const navItems: Record<RoleType, NavItemType[]> = {
  customer: [
    ['home', '홈', HomeIcon],
    ['search', '검색', Search],
    ['chat', '채팅', MessageCircle],
    ['store', '스토어', ShoppingBag],
    ['profile', '프로필', UserRound],
  ],
  influencer: [
    ['studio', '스튜디오', LayoutDashboard],
    ['chat', '채팅', MessageCircle],
    ['catalog', '상품', ShoppingBag],
    ['earnings', '수익', Wallet],
    ['profile', '프로필', UserRound],
  ],
  admin: [
    ['ops', '운영', LayoutDashboard],
    ['home', '홈', HomeIcon],
    ['review', '심사', ClipboardCheck],
    ['moderate', '관리', Shield],
    ['settlement', '정산', Wallet],
    ['profile', '프로필', UserRound],
  ],
}

export const applicationNav: NavItemType[] = [
  ['apply', '입점', ClipboardCheck],
  ['profile', '프로필', UserRound],
]

export const pages: Record<PageKeyType, ComponentType<IPageProps>> = {
  home: HomeScreen,
  search: DiscoverScreen,
  chat: ChatScreen,
  store: CoinStoreScreen,
  profile: ProfileScreen,
  studio: CreatorStudioScreen,
  catalog: CreatorCatalogScreen,
  earnings: CreatorEarningsScreen,
  settlement: AdminSettlementScreen,
  ops: AdminDashboardScreen,
  review: CreatorReviewScreen,
  moderate: ModerationScreen,
  apply: CreatorApplicationScreen,
}
