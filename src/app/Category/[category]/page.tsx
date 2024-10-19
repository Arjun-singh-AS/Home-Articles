"use client"
import Homeproduct from '@/components/Homeproduct';
import { InfiniteMovingCardsDemo } from '@/components/Movingcards';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProducts } from '@/context/ProductContext';
// In '@/model/Product.ts'

import { useParams } from 'next/navigation';
export type Review = {
  username: string;
  comment: string;
  rating: number;
};

export type Size = {
  size: string;
  instock: boolean;
  price: number;  // Added price specific to size
  mprice:number;
  images: string[]; // Retained the images field in Size
};

export type ColorVariant = {
  color: string;
  sizes: Size[];
};

export type Product = {
  id: number;
  name: string;
  sellingPrice: number;
  markPrice: number;
  description: string;
  hproduct: boolean;
  ratings: number;
  reviews: Review[];
  colors: ColorVariant[];
  categories: string[];
  image: string;
};

function Products() {
  const { products, loading, error } = useProducts(); // Fetch products with loading and error states
  
  


  // if (loading) return <p>Loading products...</p>;
  // if (error) return <p>Error fetching products: {error}</p>;
  const { category } = useParams();

const res = products.filter((product) =>
    product.categories.some((productCategory: string) =>
        productCategory.includes(String(category))
    )
);
  const searchParams = useSearchParams(); // Get the search params
  const [searchResults, setSearchResults] = useState<Product[]>([]); // State for search results


  // Handle loading and error states
 


  console.log('Products:', products);
  console.log('Loading:', loading);
  console.log('Error:', error);
  useEffect(() => {
    const query = searchParams.get('search') || '';
    
    if (products.length > 0) { // Check if products are available
      const results = res.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchParams, products,res]); // Re-run when search params or products change


  // Determine which products to display
  const displayedProducts = searchResults.length > 0 ? searchResults : res;

  return (
    <div>
      <InfiniteMovingCardsDemo />
      <Homeproduct value={{ product: displayedProducts }} /> {/* Pass filtered products to Homeproduct */}
    </div>
  );
}

export default Products;
