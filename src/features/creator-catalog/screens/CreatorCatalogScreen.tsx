import { PackagePlus } from 'lucide-react'
import ProductMedia from '../../../shared/components/products/ProductMedia'
import RouletteWheelDialog from '../../../shared/components/roulette/RouletteWheelDialog'
import Button from '../../../shared/components/ui/Button'
import ConfirmActionDialog from '../../../shared/components/ui/ConfirmActionDialog'
import Modal from '../../../shared/components/ui/Modal'
import PageTitle from '../../../shared/components/ui/PageTitle'
import type { OperatorProps } from '../../../shared/types/navigation'
import CreateProductDialog from '../components/CreateProductDialog'
import CreatorProductList from '../components/CreatorProductList'
import CreatorRouletteSettings from '../components/CreatorRouletteSettings'
import RouletteEditorDialog from '../components/RouletteEditorDialog'
import { useCreatorCatalog } from '../hooks/useCreatorCatalog'

export default function CreatorCatalogScreen({ account, notify }: OperatorProps) {
  const {
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
  } = useCreatorCatalog({ account, notify })

  return (
    <>
      <PageTitle
        label="CREATOR SHOP"
        title="상품 · 룰렛"
        subtitle="구독자가 코인으로 이용할 데모 상품을 구성하세요."
      >
        <Button onClick={() => setDialog('product')}>
          <PackagePlus size={17} /> 상품 등록
        </Button>
      </PageTitle>
      <CreatorProductList products={products} onPreview={setPreview} onArchive={setDialog} />
      <CreatorRouletteSettings
        roulette={roulette}
        onPreview={() => setDialog('roulette-preview')}
        onEdit={() => setDialog('roulette')}
      />
      {preview && (
        <Modal title={preview.name} onClose={() => setPreview(null)} protectedContent>
          <ProductMedia product={preview} viewer={account.id} />
        </Modal>
      )}
      {dialog === 'product' && (
        <CreateProductDialog onCreate={createProduct} notify={notify} onClose={closeDialog} />
      )}
      {dialog === 'roulette-preview' && (
        <RouletteWheelDialog roulette={roulette} mode="preview" onClose={closeDialog} />
      )}
      {dialog === 'roulette' && (
        <RouletteEditorDialog roulette={roulette} onClose={closeDialog} onSave={saveRoulette} />
      )}
      {dialog && typeof dialog === 'object' && (
        <ConfirmActionDialog
          title="상품 판매 종료"
          description={dialog.name + ' 판매를 종료할까요?'}
          actionLabel="판매 종료"
          onConfirm={() => archiveProduct(dialog.id)}
          onClose={closeDialog}
        />
      )}
    </>
  )
}
