import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartContextProvider} from '../context/CartContext';
import CartIconSection from '@/components/CartIconSection'
import Footer from '@/components/Footer'
import SearchBar from '../components/SearchBar';
import { ProductProvider } from '@/context/ProductContext';
// import { EdgeStoreProvider } from "@/lib/edgestore";
import { UserProvider } from "@/context/UserContext";
import Head from "next/head";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: "Home Articles - Quality Home Products in India",
    template: "%s - Home Articles"
  },
  description: "Discover a wide range of quality home products on Home Articles, India's online destination for furniture, kitchen essentials, and home decor at unbeatable prices.",
  openGraph: {
    title: "Home Articles - Quality Home Products in India",
    description: "Shop the best in home decor, furniture, and kitchen essentials exclusively in India with Home Articles.",
    url: "https://home-articles.vercel.app",
    siteName: "Home Articles",
    images: [
      {
        url: "https://yourdomain.com/og-image.jpeg",
        width: 1200,
        height: 630,
        alt: "Home Articles - Quality Home Products",
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Home Articles - India's Online Destination for Quality Home Products",
    description: "Explore top-quality furniture, kitchen essentials, and decor exclusively for India on Home Articles.",
    images: ["https://home-articles.vercel.app/og-image.jpeg"]
  },
  
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className="dark">
      <Head>
        <title>Home Articles - Quality Home Products in India</title>
        <meta name="description" content="Discover a wide range of quality home products on Home Articles, India's online destination for decoration, kitchen essentials, and home decor at unbeatable prices." />
        
        {/* Open Graph Meta Tags for Facebook and Instagram */}
        <meta property="og:title" content="Home Articles - Quality Home Products in India" />
        <meta property="og:description" content="Shop the best in home decor, unique, and kitchen essentials exclusively in India with Home Articles." />
        <meta property="og:url" content="https://home-articles.vercel.app/" />
        <meta property="og:site_name" content="Home Articles" />
        <meta property="og:image" content="https://home-articles.vercel.app/og-image.jpeg" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:type" content="website" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Articles - India's Online Destination for Quality Home Products" />
        <meta name="twitter:description" content="Explore top-quality home decoration, kitchen essentials, and decor exclusively for India on Home Articles." />
        <meta name="twitter:image" content="https://home-articles.vercel.app/og-image.jpeg" />  

        {/* Optional Facebook App ID */}
        <meta property="fb:app_id" content="YOUR_FACEBOOK_APP_ID" />
      </Head>
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
        {/* <EdgeStoreProvide/> */}
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
        {/* </EdgeStoreProvider> */}
        </UserProvider>
        
      </body>
    </html>
  );
}
