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
  const { setHasIdToken, user } = useUser()

  const handleBuy = () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please Login to proceed')
      router.push('/singin2')
      return;
    }
    setHasIdToken(token)
    if (!user || !user.isVerified) {
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
    <div className="bg-white w-full mt-28 pt-10">
      {/* Cart content limited to 80% width and centered */}
      <div className="container max-w-[95%] lg:max-w-[80%] mx-auto">
        <div className="flex justify-center text-black">
          <h2 className="text-3xl font-bold text-black">Your Cart</h2> {/* Increased font size for better visibility */}
        </div>
        <div className="bg-white">
          {cartWithProductDetails.length === 0 ? (
            <p className="text-lg text-gray-800 text-center">Your cart is empty</p>
          ) : (
            <ul className="space-y-6"> {/* Added space between each cart item */}
              {cartWithProductDetails.map((cartItem) => (
                <li
                  key={`${cartItem.id}-${cartItem.color}-${cartItem.size}`}
                  className="relative flex items-center bg-white p-3 rounded shadow-md"
                >
                  <Image
                    src={"/data/t-shirt.jpg"} // Replace with the actual image path
                    alt={cartItem.product?.name || ''}
                    width={130}
                    height={40}
                    className="w-30 h-40 object-cover rounded"
                  />
                  <div className="flex-1 ml-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {cartItem.product?.name}
                    </h3>
                    <p className="text-sm text-gray-800">Color: {cartItem.color}</p>
                    <p className="text-sm text-gray-800">Size: {cartItem.size}</p>
                    <p className="mt-1 text-md font-medium text-gray-800">
                      Price: ${cartItem.price}
                    </p>
                    <p className="mt-1 text-md font-medium text-gray-800">
                      Total: ${cartItem.total.toFixed(2)}
                    </p>

                    <div className="inline-flex border border-gray-300 p-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            cartItem.id,
                            cartItem.color,
                            cartItem.size,
                            cartItem.quantity - 1
                          )
                        }
                        className="bg-gray-300 text-gray-700 py-1 px-4 rounded hover:bg-gray-400"
                        disabled={cartItem.quantity === 1}
                      >
                        -
                      </button>
                      <span className="mx-3 text-lg text-gray-800">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            cartItem.id,
                            cartItem.color,
                            cartItem.size,
                            cartItem.quantity + 1
                          )
                        }
                        className="bg-gray-300 text-gray-700 py-1 px-3 rounded hover:bg-gray-400"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Cross (X) Remove Button */}
                  <button
                    onClick={() =>
                      removeFromCart(cartItem.id, cartItem.color, cartItem.size)
                    }
                    className="absolute top-0 right-0 bg-gray-300 text-gray-700 p-2 m-1 hover:bg-gray-600"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
          {cartWithProductDetails.length > 0 && (
            <div className="mt-12 text-lg font-bold text-black text-right md:flex md:justify-between md:items-center py-2">
              <span className="block mb-4 md:mb-0">
                Overall Total: ${overallTotal.toFixed(2)}{" "}
                <span className="line-through">
                  ${(overallTotal + 200).toFixed(2)}
                </span>
              </span>
              {/* Display overall total */}
              <button
                className="w-full md:w-auto bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-700 transition"
                onClick={handleBuy}
              >
                Buy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

  );
};

export default Cart;
