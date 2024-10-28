'use client';
import HeroSection from "@/components/HeroSection";
import Homeproduct from "@/components/Homeproduct";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import { useUser } from '@/context/UserContext';

export const dynamic = 'force-dynamic';

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

export default function Home() {
  // Always call hooks in the same order
  const router = useRouter();
  const { products} = useProducts();
  const searchParams = useSearchParams(); // Always call this hook

  // State for search results
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  

  const { setHasIdToken}=useUser()

  

  useEffect(()=>{
    const token = localStorage.getItem('authToken');
    setHasIdToken(token)

  },[router])
  
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
