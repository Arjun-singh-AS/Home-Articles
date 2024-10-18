'use client'; // Ensure this file is treated as a client component
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define types
type Review = {
  username: string;
  comment: string;
  rating: number;
};

interface Size{
  size: string;
  instock: boolean;
  price: number;  // Added price specific to size
  mprice:number;
  images: string[]; // Retained the images field in Size
}

type ColorVariant = {
  color: string;
  sizes: Size[];
   // Multiple images for each color variant
};

export type Product = {
  id: number;
  name: string;
  sellingPrice: number;  // The current selling price of the product
  markPrice: number;     // The original marked price of the product
  description: string;
  hproduct: boolean;     // Indicates if the product is a hot product
  ratings: number;       // Average rating as a number
  reviews: Review[];     // Array of reviews for the product
  colors: ColorVariant[]; // Array of color variants
  categories: string[];   // Array of categories for the product
  image: string;     
};

export type CartItem = {
  id: number;
  quantity: number;
  color: string;
  size: string;
  price:number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Product, color: string, size: string, quantity: number,price:number) => void;
  removeFromCart: (id: number, color: string, size: string) => void;
  updateQuantity: (id: number, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, []);

  // Update localStorage whenever cartItems changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems'); // Clean up if the cart is empty
    }
  }, [cartItems]);

  const addToCart = (item: Product, color: string, size: string, quantity: number,price:number) => {
    const existingItem = cartItems.find(cartItem =>
      cartItem.id === item.id && cartItem.color === color && cartItem.size === size
    );

    if (existingItem) {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === item.id && cartItem.color === color && cartItem.size === size
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      ));
    } else {
      setCartItems([...cartItems, { id: item.id, quantity, color, size ,price}]);
    }
  };

  const removeFromCart = (id: number, color: string, size: string) => {
    setCartItems(cartItems.filter(cartItem =>
      !(cartItem.id === id && cartItem.color === color && cartItem.size === size)
    ));
  };

  const updateQuantity = (id: number, color: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, color, size);
    } else {
      setCartItems(cartItems.map(cartItem =>
        cartItem.id === id && cartItem.color === color && cartItem.size === size
          ? { ...cartItem, quantity }
          : cartItem
      ));
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartContextProvider');
  }
  return context;
};
