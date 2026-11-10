import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useProductStore } from '../../../shared/store/products/product'
import { useRouletteStore } from '../../../shared/store/roulette/roulette'
import type { ActionResult } from '../../../shared/types/actionResult'
import type { Product, ProductSubmission, Roulette } from '../../../shared/types/commerce'
import type { OperatorProps } from '../../../shared/types/navigation'

export function useCreatorCatalog({ account, notify }: OperatorProps) {
  const allProducts = useProductStore((state) => state.products)
  const roulettes = useRouletteStore((state) => state.roulettes)
  const { addProduct, removeProduct } = useProductStore(
    useShallow(({ addProduct, removeProduct }) => ({ addProduct, removeProduct }))
  )
  const saveRouletteAction = useRouletteStore((state) => state.saveRoulette)
  const [dialog, setDialog] = useState<'product' | 'roulette-preview' | 'roulette' | Product | null>(null)
  const [preview, setPreview] = useState<Product | null>(null)
  const products = allProducts.filter((p) => p.owner === account.id && !p.archived)
  const roulette = roulettes[account.id]
  const finish = (result: ActionResult, message: string) => {
    notify(result, message)
    if (!result.error) {
      setDialog(null)
    }
  }
  const closeDialog = () => setDialog(null)
  const createProduct = (submission: ProductSubmission) =>
    finish(addProduct(submission), '상품 검수를 요청했어요.')
  const saveRoulette = ({ cost, rewards, topPrizeCost }: Roulette) =>
    finish(saveRouletteAction(cost, rewards, topPrizeCost), '룰렛을 저장했어요.')
  const archiveProduct = (id: string) => finish(removeProduct(id), '판매를 종료했어요.')

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
