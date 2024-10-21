// import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartContextProvider} from '../context/CartContext';
import CartIconSection from '@/components/CartIconSection'
import Footer from '@/components/Footer'
import SearchBar from '../components/SearchBar';
import { ProductProvider } from '@/context/ProductContext';
import { EdgeStoreProvider } from "@/lib/edgestore";
import { UserProvider } from "@/context/UserContext";

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="dark">
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
        <EdgeStoreProvider>
        <ProductProvider>
        <CartContextProvider>
        <div className="relative w-full flex item-center justify-center">
        <div className='m-2 px-4 flex fixed top-0 left-0 w-full z-50  shadow-md items-center justify-between'>
        <SearchBar/>
        <CartIconSection/>
        </div>
        <Navbar/>
        </div>
        {/* <div className="relative">
          <div className="absolute top-0 right-0 m-0 sm:m-4 bg-dark-500 text-white p-4 rounded">
            <CartIconSection />
          </div>
        </div> */}
        <div className="flex flex-col min-h-screen">
        {children}
        </div>
        <Footer/>
        </CartContextProvider>
        </ProductProvider> 
        </EdgeStoreProvider>
        </UserProvider>
        
      </body>
    </html>
  );
}
