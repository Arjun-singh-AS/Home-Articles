"use client";
import React from 'react';
import { useCart } from '@/context/CartContext'; // Ensure the import path is correct
import { useProducts } from '@/context/ProductContext'; // Ensure the import path is correct
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';

const Cart = () => {
  const { products } = useProducts(); // Accessing all products
  const { cartItems, updateQuantity, removeFromCart } = useCart(); // Get cart operations

  // Map cart items to their corresponding products
  const cartWithProductDetails = cartItems.map(cartItem => {
    const product = products.find(p => p.id === cartItem.id);
    return {
      ...cartItem,
      product, // Attach full product details
      total: (cartItem.price || 0) * cartItem.quantity, // Calculate total for this item
    };
  });

  // Calculate overall total
  const overallTotal = cartWithProductDetails.reduce((total, cartItem) => total + (cartItem.total || 0), 0);

  const router = useRouter();
  const {setHasIdToken, user} = useUser()

  const handleBuy = () => {
    const token = localStorage.getItem('authToken');
    if(!token){
      alert('Please Login to proceed')
      router.push('/singin2')
      return;
    }
    setHasIdToken(token)
    if(!user || !user.isVerified){
      alert('Please Verified your self to procceed')
      router.push('/singin2')
      return;
    }
    if (cartWithProductDetails.length > 0) {
      // Redirect to the payment page or perform the action
      
      router.push('/ordercart'); // Example: Redirect to payment page
    } else {
      // Optionally show an error or handle empty cart scenario
      alert('Your cart is empty!');
    }
  };

  return (
    <div className="bg-white">
    <div className="bg-white container mx-auto my-20 py-15 max-w-[80%]"> {/* Limit width to 80% and center */}
      <div className="flex justify-center mb-4">
        <h2 className="text-2xl font-bold text-white-800">Your Cart</h2>
      </div>
      {cartWithProductDetails.length === 0 ? (
        <p className="text-lg text-gray-800 text-center">Your cart is empty</p>
      ) : (
        <ul className="space-y-4">
          {cartWithProductDetails.map((cartItem) => (
            <li key={`${cartItem.id}-${cartItem.color}-${cartItem.size}`} className="flex items-center bg-white p-4 rounded shadow-md">
              <Image
                src={"/data/t-shirt.jpg"} // Replace with the actual image path
                alt={cartItem.product?.name || ''}
                width={130}
                height={40}
                className="w-30 h-40 object-cover rounded"
              />
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{cartItem.product?.name}</h3>
                <p className="text-sm text-gray-800">Color: {cartItem.color}</p>
                <p className="text-sm text-gray-800">Size: {cartItem.size}</p>
                <p className="mt-1 text-md font-medium text-gray-800">Price: ${cartItem.price}</p>
                <p className="mt-1 text-md font-medium text-gray-800">Total: ${cartItem.total.toFixed(2)}</p> {/* Total value for this product */}
                <p className="mt-2 text-sm text-gray-800">{cartItem.product?.description}</p>
              </div>
              <div className="flex items-center ml-4">
                <button
                  onClick={() => updateQuantity(cartItem.id, cartItem.color, cartItem.size, cartItem.quantity - 1)}
                  className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                  disabled={cartItem.quantity === 1}
                >
                  -
                </button>
                <span className="mx-4 text-lg text-gray-800">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(cartItem.id, cartItem.color, cartItem.size, cartItem.quantity + 1)}
                  className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(cartItem.id, cartItem.color, cartItem.size)}
                  className="mx-5 bg-red-500 text-white p-2 rounded hover:bg-red-600 ml-4"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cartWithProductDetails.length > 0 && (
        <div className="mt-6 text-lg font-bold text-white-800 text-right flex justify-center mb-4">
          Overall Total: ${overallTotal.toFixed(2)} {/* Display overall total */}
          <button
          className="ml-20 bg-blue-500 text-white px-6 py-1 rounded hover:bg-blue-700 transition"
          onClick={handleBuy}
        >
          Buy
        </button>
        </div>

      )}
    </div>
    </div>
  );
};

export default Cart;
