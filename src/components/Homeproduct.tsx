'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { BackgroundGradient } from './ui/backgound-gradient';
import ProductRate from './ProductRate';
import { useCart } from '../context/CartContext';
import Modal from './Modal'; // Import the Modal component
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

type HomeProductProps = {
  value: {
    product: Product[];
  };
};

const Homeproduct: React.FC<HomeProductProps> = ({ value }) => {
  const router = useRouter();
  const { cartItems, addToCart } = useCart();
  const { product } = value;

  const [addedProductName, setAddedProductName] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const productsPerPage = 12; // Define how many products to display per page
  const totalProducts = product.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  useEffect(() => {
    console.log(cartItems.length);
  }, [cartItems]);

  const handleAddToCartClick = (productItem: Product) => {
    setSelectedProduct(productItem);
    setIsModalOpen(true); // Open modal
  };

  const handleAddToCart = (color: string, size: string, quantity: number, price: number) => {
    if (selectedProduct) {
      addToCart(selectedProduct, color, size, quantity, price); // Pass selected options to addToCart
      setIsModalOpen(false); // Close modal
      setMessage("Product added successfully!");
      setAddedProductName(selectedProduct.name); // Set the name of the added product

      // Reset the message after 3 seconds
      setTimeout(() => {
        setMessage("");
        setAddedProductName(""); // Reset the added product name after the message is cleared
      }, 3000);
    }
  };

  const handleBuy = (productItem: Product) => {
    router.push(`products/${productItem.id}`);
  };

  // Paginate products
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = product.slice(startIndex, startIndex + productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="py-12 bg-gray-900">
      <div>
        <div className="text-center">
          <h2 className="text-base text-teal-600 font-semibold tracking-wide uppercase">Products</h2>
          <p className="m-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Our Best Products
          </p>
        </div>
      </div>

      {/* Display Products */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-8 justify-center">
        {paginatedProducts.map((productItem) => (
          <div key={productItem.id} className="flex justify-center">
            <BackgroundGradient className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-full w-full max-w-xs shadow-lg transition-transform transform hover:scale-105">
              <Link href={`/products/${productItem.id}`}>
              <Image
  src={`/data/t-shirt.jpg`}
  alt={productItem.name}
  layout="responsive"
  width={500} // Set an aspect ratio with width and height
  height={750}
  className="object-contain h-32 sm:h-48 w-full"
/>
              </Link>

              <div className="p-2 sm:p-4 flex flex-col items-center text-center flex-grow">
                <p className="text-sm sm:text-lg lg:text-xl text-black mt-1 sm:mt-4 mb-1 sm:mb-2 dark:text-neutral-200">
                  {productItem.name}
                </p>

                {/* Ratings and Reviews */}
                <div className="text-blue">
                  <ProductRate rate={productItem.ratings} count={productItem.reviews.length} />
                </div>
                <span className="line-through text-gray-500 text-sm sm:text-base">
                  M.R.P ₹ {productItem.markPrice}
                </span>
                <span className="text-gray-500 text-sm sm:text-base">₹ {productItem.sellingPrice}</span>

                <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 mt-2 sm:mt-4">
                  <button
                    className="rounded-full px-3 py-1 text-xs sm:text-sm lg:text-base text-white flex items-center justify-center space-x-1 bg-black font-bold dark:bg-zinc-800"
                    onClick={() => handleBuy(productItem)}
                  >
                    <span className="mx-1">Buy now</span>
                  </button>

                  <div>
                    <button
                      className="rounded-full px-3 py-1 text-xs sm:text-sm lg:text-base text-white flex items-center justify-center space-x-1 bg-black font-bold dark:bg-zinc-800 mt-2 sm:mt-0"
                      onClick={() => handleAddToCartClick(productItem)}
                    >
                      <span>Add to cart</span>
                    </button>
                  </div>
                </div>

                {/* Conditionally render the message only for the added product */}
                {addedProductName === productItem.name && message && (
                  <p className="mt-2 text-green-600">{message}</p> // Success message
                )}
              </div>
            </BackgroundGradient>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-8 mx-20">
        <button
          className={`bg-teal-600 text-white px-4 py-2 rounded-full ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`bg-teal-600 text-white px-4 py-2 rounded-full ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal for selecting color, size, and quantity */}
      {selectedProduct && (
        <Modal
          show={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Link to view more products */}
      <div className="mt-20 text-center">
        <Link href="/products">View More Products</Link>
      </div>
    </div>
  );
};

export default Homeproduct;
