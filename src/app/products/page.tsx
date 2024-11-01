"use client"
import Homeproduct from '@/components/Homeproduct';
import { InfiniteMovingCardsDemo } from '@/components/Movingcards';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Metadata } from 'next';

export const metadata:Metadata={
  title:"Products"
}
// In '@/model/Product.ts'
type Review = {
  username: string;
  comment: string;
  rating: number;
};

type Size = {
  size: string;
  instock: boolean;
  price: number;  // Added price specific to size
  mprice:number;
  images: string[]; // Retained the images field in Size
};

type ColorVariant = {
  color: string;
  sizes: Size[];
};

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
  image: string;          // URL for the main product image
};


function Products() {
  const { products, loading, error } = useProducts(); // Fetch products with loading and error states
  
  
  // if (loading) return <p>Loading products...</p>;
  // if (error) return <p>Error fetching products: {error}</p>;
  const searchParams = useSearchParams(); // Get the search params
  const [searchResults, setSearchResults] = useState<Product[]>([]); // State for search results


  // Handle loading and error states
 


  console.log('Products:', products);
  console.log('Loading:', loading);
  console.log('Error:', error);
  useEffect(() => {
    const query = searchParams.get('search') || '';
    
    if (products.length > 0) { // Check if products are available
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchParams, products]); // Re-run when search params or products change


  // Determine which products to display
  const displayedProducts = searchResults.length > 0 ? searchResults : products;

  return (
    <div>
      <InfiniteMovingCardsDemo />
      <Homeproduct value={{ product: displayedProducts }} /> {/* Pass filtered products to Homeproduct */}
    </div>
  );
}

export default Products;
