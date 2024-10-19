'use client';
import Link from 'next/link';
// import React, { useContext } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';

function CartIconSection() {
  const { cartItems} = useCart();
  return (
    <div>
      <Link href={'/Cart'}>
        <div className="relative flex items-center">
          <ShoppingCartIcon className="h-8 w-8 text-white-700 hover:text-white-900" />
          {/* Cart Items Count */}
          {/* cartItems.length > 0 &&  */}
          {cartItems.length > 0 &&  (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-red text-xs">
              {cartItems.length}
            </span>
          )}
          
        </div>
      </Link>
    </div>
  );
}

export default CartIconSection;
