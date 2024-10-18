import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartContextProvider} from '../context/CartContext';
import CartIconSection from '@/components/CartIconSection'
import Footer from '@/components/Footer'
import SearchBar from '../components/SearchBar';
import { ProductProvider } from '@/context/ProductContext';
import { EdgeStoreProvider } from "@/lib/edgestore";
import { UserProvider } from "@/context/UserContext";

export const metadata: Metadata = {
  title: 'Trendify - Unique & Trending Home Products',
  description: 'Discover the latest and most unique home design products that add a touch of elegance and trendiness to your space. Shop from a wide range of trending products that suit every style and preference.',
  keywords: 'home design, trending products, unique home decor, trending furniture, modern home decor, interior design trends, home accessories, home improvement, e-commerce, stylish home products',
  openGraph: {
    title: 'Trendify - Unique & Trending Home Products',
    description: 'Explore stylish and unique home decor and design products that will transform your space. Trendify brings the latest trending products at unbeatable prices.',
    url: 'https://www.trendify.com', // replace with your actual URL
    images: [
      {
        url: '/images/trending-home-products.jpg', // replace with your own image URL
        width: 800,
        height: 600,
        alt: 'Trending home design products',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@trendify',
    title: 'Trendify - Shop Unique & Trending Home Products',
    description: 'Find the latest home design trends and unique products on Trendify. Shop our trending collections for stylish and modern decor items.',
    // image: '/images/trending-home-products.jpg', // replace with your own image
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  // author: 'Trendify Team',
  themeColor: '#F57C00', // This can match your website's theme color
};

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
