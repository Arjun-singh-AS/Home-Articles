import ProductDetail from '@/components/ProductDetails'
import { Metadata } from 'next'
export const metadata:Metadata={
  title:"Prduct"
}


function productpage() {
  return (
    <div>
      <ProductDetail/>
    </div>
  )
}

export default productpage
