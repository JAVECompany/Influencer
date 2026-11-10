import { useState } from 'react'
import { useAppStore } from '../../../shared/store/core/useAppStore'
import type { ActionResult } from '../../../shared/types/actionResult'
import type { Product, Roulette } from '../../../shared/types/commerce'
import type { OperatorProps } from '../../../shared/types/navigation'

export function useCreatorCatalog({ account, notify }: OperatorProps) {
  const state = useAppStore()
  const [dialog, setDialog] = useState<'product' | 'roulette-preview' | 'roulette' | Product | null>(null)
  const [preview, setPreview] = useState<Product | null>(null)
  const products = state.products.filter((p) => p.owner === account.id && !p.archived)
  const roulette = state.roulettes[account.id]
  const finish = (result: ActionResult, message: string) => {
    notify(result, message)
    if (!result.error) setDialog(null)
  }
  const closeDialog = () => setDialog(null)
  const createProduct = (name: string, detail: string, cost: number, media: string) =>
    finish(state.addProduct(name, detail, cost, media), '상품을 등록했어요.')
  const saveRoulette = ({ cost, rewards, topPrizeCost }: Roulette) =>
    finish(state.saveRoulette(cost, rewards, topPrizeCost), '룰렛을 저장했어요.')
  const archiveProduct = (id: string) => finish(state.removeProduct(id), '판매를 종료했어요.')

  return {
    dialog,
    setDialog,
    preview,
    setPreview,
    products,
    roulette,
    closeDialog,
    createProduct,
    saveRoulette,
    archiveProduct,
  }
}
