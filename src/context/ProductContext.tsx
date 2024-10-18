'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Review = {
  username: string;
  comment: string;
  rating: number;
};
interface Size {
  size: string;
  instock: boolean;
  price: number;  // Added price specific to size
  mprice:number;
  images: string[]; // Retained the images field in Size
}
interface ColorVariant{
  color: string;
  sizes: Size[];
}

type Product = {
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

// Define ProductContextType for type-checking the context value
type ProductContextType = {
  products: Product[]; // Array of products
  loading: boolean; // Loading state
  error: string | null; // Error state
};

// Initialize the ProductContext with a null default value
const ProductContext = createContext<ProductContextType | null>(null);

// ProductProvider component to wrap the application and provide product functionality
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products'); // Call GET request
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products); // Assuming the API returns products in this format
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message); // Access error message
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); // Only runs once on component mount

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to access the ProductContext and use its values/functions
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
