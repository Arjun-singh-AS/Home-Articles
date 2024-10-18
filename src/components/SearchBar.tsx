'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState,useRef } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useDebounce } from 'use-debounce';
import { usePathname } from 'next/navigation';

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
  image: string;        
};

function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [query] = useDebounce(searchTerm, 500);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(()=>{
      const fullRoute = `${pathname}?${searchParams.toString()}`;
      if(query){
        router.push(`/?search=${query}`)
      }
      else if(!query && fullRoute.includes('products')){
        router.push(`/products`)
      }
      else{
        router.push(`/`)
      }
      
    },[query])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
        router.push(`?search=${searchTerm}`);
    }
  };
  return (
    <form className="relative w-full" onSubmit={handleSubmit}>
    <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      <input
        type="search"
        placeholder="Search"
        className="w-full p-3 md:p-4 rounded-full bg-slate-800 text-white placeholder-gray-400 focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 md:p-4 bg-slate-900 text-white rounded-full"
        aria-label="Search"
      >
        <AiOutlineSearch />
      </button>
    </div>
  </form>
  )
}

export default SearchBar
