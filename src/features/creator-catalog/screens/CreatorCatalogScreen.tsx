import { PackagePlus } from 'lucide-react'
import ProductMedia from '../../../shared/components/products/ProductMedia'
import ShippingOrderList from '../../../shared/components/products/ShippingOrderList'
import RouletteWheelDialog from '../../../shared/components/roulette/RouletteWheelDialog'
import Button from '../../../shared/components/ui/actions/Button'
import ConfirmActionDialog from '../../../shared/components/ui/dialogs/ConfirmActionDialog'
import Modal from '../../../shared/components/ui/dialogs/Modal'
import PageTitle from '../../../shared/components/ui/layout/PageTitle'
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
      <PageTitle title="상품 · 룰렛">
        <Button onClick={() => setDialog('product')}>
          <PackagePlus size={17} /> 상품 등록
        </Button>
      </PageTitle>
      <CreatorProductList products={products} onPreview={setPreview} onArchive={setDialog} />
      <ShippingOrderList account={account} notify={notify} />
      <CreatorRouletteSettings
        roulette={roulette}
        onPreview={() => setDialog('roulette-preview')}
        onEdit={() => setDialog('roulette')}
      />
      {preview && (
        <Modal title={preview.name} onClose={() => setPreview(null)} protectedContent>
          <ProductMedia product={preview} />
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
