import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useProductStore } from '../../../shared/store/products/product'
import { useRouletteStore } from '../../../shared/store/roulette/roulette'
import type { ActionResultType } from '../../../shared/types/actionResult'
import type { IProduct, IProductSubmission, IRoulette } from '../../../shared/types/commerce'
import type { OperatorPropsType } from '../../../shared/types/navigation'

export function useCreatorCatalog({ account, notify }: OperatorPropsType) {
  const allProducts = useProductStore((s) => s.products)
  const roulette = useRouletteStore((s) => s.roulettes[account.id])
  const { addProduct, removeProduct } = useProductStore(
    useShallow(({ addProduct, removeProduct }) => ({ addProduct, removeProduct }))
  )
  const saveRouletteAction = useRouletteStore((s) => s.saveRoulette)
  const [dialog, setDialog] = useState<'product' | 'roulette-preview' | 'roulette' | IProduct | null>(null)
  const [preview, setPreview] = useState<IProduct | null>(null)
  const products = allProducts.filter((p) => p.owner === account.id && !p.archived)
  const finish = (result: ActionResultType, message: string) => {
    notify(result, message)
    if (!result.error) {
      setDialog(null)
    }
  }
  const closeDialog = () => setDialog(null)
  const createProduct = (submission: IProductSubmission) =>
    finish(addProduct(submission), '상품 검수를 요청했어요.')
  const saveRoulette = ({ cost, rewards, topPrizeCost }: IRoulette) =>
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
