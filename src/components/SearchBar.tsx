'use client'
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState} from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useDebounce } from 'use-debounce';
import { usePathname } from 'next/navigation';



function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [query] = useDebounce(searchTerm, 500);

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
