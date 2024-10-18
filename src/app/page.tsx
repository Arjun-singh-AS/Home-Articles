'use client';
import HeroSection from "@/components/HeroSection";
import Homeproduct from "@/components/Homeproduct";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';

type Product = {
  id: number;
  name: string;
  sellingPrice: number;
  markPrice: number;
  description: string;
  hproduct: boolean;
  ratings: number;
  reviews: any[];
  colors: any[];
  categories: string[];
  image: string;
};

export default function Home() {
  // Always call hooks in the same order
  const { products, loading, error } = useProducts();
  const searchParams = useSearchParams(); // Always call this hook

  // State for search results
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // Ensure hooks are used unconditionally
  useEffect(() => {
    const query = searchParams.get('search') || '';

    if (products.length > 0) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchParams, products]);

  // Handle loading and error states
  // if (loading) return <p>Loading products...</p>;
  // if (error) return <p>Error fetching products: {error}</p>;

  // Determine displayed products
  const productItems = products.filter((product) => product.hproduct);
  const displayedProducts = searchResults.length > 0 ? searchResults : productItems;

  return (
    <main className='min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.03]'>
      <HeroSection />
      <Homeproduct value={{ product: displayedProducts }} />
    </main>
  );
}
