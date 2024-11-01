import Cart from '@/components/Cart'
import { Metadata } from 'next';
import React from 'react'
export const dynamic = 'force-dynamic';

export const metadata:Metadata={
  title:"Cart"
}

function CatPage() {
  return (
    <div>
      <Cart/>
    </div>
  )
}

export default CatPage
