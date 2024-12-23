'use client';

import { useParams } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { SetStateAction, useEffect, useState } from 'react';
import ProductRate from './ProductRate';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/context/ProductContext';
import Image from 'next/image';

type Review = {
  username: string;
  comment: string;
  rating: number;
};
type Size = {
  size: string;
  instock: boolean;
  price: number;  // Added price specific to size
  mprice: number;
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

const ProductDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const { cartItems, addToCart, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const { products } = useProducts();
  // Find the product by its id in the products data



  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  // const [selectedImage, setSelectedImage] = useState<string>(''); 
  const [price, setPrice] = useState<number>(0);
  const [sellprice, setsellprice] = useState<number>(0);
  const [instock, setInstock] = useState<boolean>(false);

  const [reviewUsername, setReviewUsername] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  const [reviewRating, setReviewRating] = useState<number>(1);


  const [selectedImage, setSelectedImage] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [images, setImages] = useState<string[]>([]);

  // Find the product based on the id
  // const images = [
  //   '/data/t-shirt.jpg',
  //   'https://res.cloudinary.com/daib3lgaj/image/upload/v1729695898/jzzz72dlpsgelwjopw1w.png',
  //   '/data/t-shirt.jpg',
  //   '/data/t-shirt.jpg',
  // ];


  // Once the product is found, initialize the state values based on the product data
  useEffect(() => {
    if (product) {
      setSelectedSize(product.colors[0].sizes[0].size);
      setSelectedColor(product.colors[0].color);
      // setSelectedImage(product.colors[0].sizes[0].images[0]);
      setPrice(product.colors[0].sizes[0].price);
      setsellprice(product.colors[0].sizes[0].mprice);
      setInstock(product.colors[0].sizes[0].instock);
      if (product.colors[0].sizes[0].images) {
        setImages(product.colors[0].sizes[0].images);
      }
    }
  }, []);

  const product = products.find((item) => item.id === Number(id));
  const cartp = cartItems.find((item) => item.id == product?.id && item.color == selectedColor && item.size == selectedSize)

  if (!product) {
    return (
      <div className="text-center text-red-500 font-bold text-xl">Product not found.</div>
    );
  }

  const handleColorChange = (colorVariant: ColorVariant) => {
    setSelectedColor(colorVariant.color);
    setSelectedSize(colorVariant.sizes[0].size); // Default to the first size of the new color

    // Get the first size details for the selected color
    const firstSizeDetails = colorVariant.sizes[0];

    if (firstSizeDetails) {
      // setSelectedImage(firstSizeDetails.images[0]); // Set the first image for the first size of the selected color
      setPrice(firstSizeDetails.price); // Set the price for the first size of the selected color
      setInstock(firstSizeDetails.instock); // Set the instock status for the first size of the selected color
    }
  };

  const handleSizeChange = (product: Product, size: string) => {
    setSelectedSize(size);

    // Find the selected color variant
    const selectedColorVariant = product.colors.find(colorVariant => colorVariant.color === selectedColor);

    // Find the size details for the selected size in the selected color
    const selectedSizeDetails = selectedColorVariant?.sizes.find(s => s.size === size);

    if (selectedSizeDetails) {
      // setSelectedImage(selectedSizeDetails.images[0]); // Set the first image for the selected size
      setPrice(selectedSizeDetails.price); // Set the price for the selected size
      setInstock(selectedSizeDetails.instock); // Set the instock status for the selected size
      setsellprice(selectedSizeDetails.mprice)
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(Number(e.target.value));
  };

  const AddToCart = (product: Product) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      size: selectedSize,
      quantity,
      color: selectedColor,
      price: price,
    };

    addToCart(product, selectedColor, selectedSize, quantity, price);

    const updatedCart = [...cartItems, cartItem];
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleBuy = (productItem: Product) => {
    console.log("Navigating to product page", productItem);
    router.push(`/products/${productItem.id}/countinues`); // Navigate to product purchase page
  };

  // const selectedColorVariant = product.colors.find((colorVariant) => colorVariant.color === selectedColor);

  // Find the size variant within the selected color
  // const selectedSizeVariant = selectedColorVariant?.sizes.find((sizeVariant) => sizeVariant.size === selectedSize);

  // Determine if the selected size is in stock
  // const isInStock = selectedSizeVariant ? selectedSizeVariant.instock : false;

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newReview: Review = {
      username: reviewUsername,
      comment: reviewComment,
      rating: reviewRating,
    };

    // Assuming you want to update the product's reviews directly in this state, 
    // you might need to handle state management appropriately if this component 
    // does not manage product data centrally.
    product.reviews.push(newReview);
    // Resetting form fields
    setReviewUsername('');
    setReviewComment('');
    setReviewRating(0);
  };


  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex - 1 + images.length) % images.length
    );
  };
  const handleImage = (index: SetStateAction<number>) => {
    setSelectedImage(index)
  }


  // const isProductInCart = () => {
  //   const foundItem = cartItems.find(
  //     (cartItem) => cartItem.id === product.id
  //   );
  //   if (foundItem) {
  //     setCartItemset(foundItem);
  //     return true;
  //   }
  //   return false;
  // };
  // Usage





  return (
    <div className="mt-20 flex justify-center items-center min-h-screen bg-dark-100">
      <div className="mt-10 bg-dark rounded-lg shadow-lg p-2  w-full mx-2">
        <div className="flex flex-col lg:flex-row items-center justify-between mx-5">
          <div className="w-full lg:w-1/2">




            <div className="container mx-auto px-4">
              {/* For large devices, show products in a grid */}
              <div className="hidden lg:grid grid-cols-[1fr_3fr] gap-6">
                <div>
                  {images.map((image, index) => (
                    <div
                      key={index}

                    >
                      <button onClick={() => handleImage(index)} className={`${selectedImage === index ? 'border-4 border-blue-500' : ''
                        }`}>
                        <Image
                          src={image} // dynamic image from the map
                          alt={`Product ${index}`}
                          width={100} // optimized width
                          height={100} // optimized height
                          objectFit="cover" // maintain aspect ratio
                          className="rounded-md shadow-sm m-2"
                        />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Large screen selected image */}
                <div>
                  <Image
                    src={images[selectedImage]}
                    alt="Selected Product"
                    width={550}
                    height={800}
                    objectFit="cover"
                    className="rounded-md shadow-sm"
                  />
                </div>
              </div>

              {/* For small devices, show a swipeable carousel */}
              <div className="lg:hidden flex items-center justify-center overflow-hidden relative">
                {/* Previous Button */}
                <button
                  onClick={prevImage}
                  className="absolute left-0 z-10 p-2 text-white bg-gray-800 rounded-full"
                >
                  &#10094; {/* Left arrow */}
                </button>

                {/* Display the current image */}
                <div className="snap-center shrink-0 w-full">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`Product ${currentImageIndex}`}
                    width={450}
                    height={600}
                    objectFit="cover"
                    className="rounded-md shadow-sm"
                  />
                </div>

                {/* Next Button */}
                <button
                  onClick={nextImage}
                  className="absolute right-0 z-10 p-2 text-white bg-gray-800 rounded-full"
                >
                  &#10095; {/* Right arrow */}
                </button>
              </div>
            </div>





          </div>

          <div className="flex-1 w-full lg:w-1/2">
            <h2 className="text-3xl font-bold mb-4 text-white-800">Product Brand Name</h2>
            <h1 className="text-3xl font-bold mb-4 text-white-800">{product.name}</h1>

            <div className="mb-4">
              <div className="text-white">
                <ProductRate rate={product.ratings} count={product.reviews.length} className="text-white" />
              </div>
            </div>
            <p className="text-lg text-white-700 mb-4">{product.description}</p>

            <div className="mb-6">
              <span className="text-2xl font-bold text-white-600">₹{price}</span>
              <span className="line-through text-gray-400 ml-2"><s>₹{sellprice}</s></span>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-white-800 mb-2">Available Colors:</h3>
                <div className="flex space-x-2">
                  {product.colors.map((colorVariant) => (
                    <button
                      key={colorVariant.color}
                      onClick={() => handleColorChange(colorVariant)}
                      className={`border border-white-400 rounded-md py-2 px-4 text-sm font-medium text-white-800 ${selectedColor === colorVariant.color ? 'bg-teal-600 text-white' : ''
                        }`}
                    >
                      {colorVariant.color}
                    </button>
                  ))}
                </div>
              </div>
            )}
          

            {product.colors.find((variant) => variant.color === selectedColor)?.sizes && (
              <div className="mb-6">
                <h3 className="font-semibold text-white-800 mb-2">Available Sizes:</h3>
                <div className="flex space-x-2">
                  {product.colors
                    .find((variant) => variant.color === selectedColor)
                    ?.sizes.map((size) => (
                      <button
                        key={size.size}
                        onClick={() => handleSizeChange(product, size.size)}
                        className={`border border-white-400 rounded-md py-2 px-4 text-sm font-medium text-white-800 ${selectedSize === size.size ? 'bg-teal-600 text-white' : ''
                          }`}
                      >
                        {size.size}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="mb-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-white mb-1">
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="block w-full max-w-xs py-2 px-3 border border-gray-300 bg-gray-900 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-base"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              {instock ? <p className="text-green-500">In stock</p> : <p className="text-red-500">Out of stock</p>}
            </div>

            <div className="flex mx-auto items-center my-3">
              <button
                className="mx-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-md shadow hover:bg-teal-700 transition-all"
                onClick={() => handleBuy(product)}
              >
                <span>Buy now </span>₹ {price}
              </button>

              {!cartp ? (
                <button
                  onClick={() => AddToCart(product)}
                  className="mx-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-md shadow hover:bg-teal-700 transition-all"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex border border-gray-300 px-2 my-auto items-center h-full">
                  <button
                    onClick={() =>
                      updateQuantity(cartp.id, cartp.color, cartp.size, cartp.quantity - 1)
                    }
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                    disabled={cartp.quantity === 1}
                  >
                    -
                  </button>
                  <span className="mx-3 text-lg text-gray-300">
                    {cartp.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(cartp.id, cartp.color, cartp.size, cartp.quantity + 1)
                    }
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
              )}
            </div>



          </div>
        </div>

        {/* Review Section */}
        <div className="mt-10">
          <h2 className="font-semibold text-white-800 mb-4 text-center">Customer Reviews</h2>
          {product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="bg-gray-800 p-4 rounded-md">
                  <p className="font-bold text-white">{review.username}</p>
                  <p className="text-white-400">{review.comment}</p>
                  <p className="text-yellow-500">Rating: {review.rating}/5</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white-400">No reviews yet.</p>
          )}
        </div>

        {/* Add Review Section */}
        <div className="mt-10">
          <h2 className="font-semibold text-white-800 mb-4">Add a Review</h2>
          <form onSubmit={handleReviewSubmit} className="bg-gray-800 p-4 rounded-md">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-white mb-1">Username:</label>
              <input
                type="text"
                id="username"
                value={reviewUsername}
                onChange={(e) => setReviewUsername(e.target.value)}
                className="block w-full border border-gray-300 bg-gray-900 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-white mb-1">Comment:</label>
              <textarea
                id="comment"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="block w-full border border-gray-300 bg-gray-900 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="rating" className="block text-sm font-medium text-white mb-1">Rating:</label>
              <select
                id="rating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
                className="block w-full border border-gray-300 bg-gray-900 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value={0}>0 Star</option>
                <option value={1}>1 Star</option>
                <option value={2}>2 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={5}>5 Stars</option>
              </select>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
