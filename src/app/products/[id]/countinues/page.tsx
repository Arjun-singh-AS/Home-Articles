'use client';

import { SetStateAction, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload to properly type decoded tokens
import { useParams } from 'next/navigation';
// import { useCart } from '../../../../context/CartContext';
import ProductRate from '../../../../components/ProductRate';
import { useProducts } from '@/context/ProductContext';
import jwt from 'jsonwebtoken';
// import mongoose from 'mongoose';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';
import Head from 'next/head';

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

// interface User {
//   username: string;
//   email: string;
//   password: string;
//   phone: string;
//   createdAt: Date;
//   addresses: string[];
//   isVerified: boolean; // Optional verification status
//   otp: string;         // Optional OTP
//   otpExpires: Date;    // Optional OTP expiration date
// }

// interface Order {
//   orderId: string;         // Unique identifier for the order
//   productId: mongoose.Schema.Types.ObjectId; // Reference to the Product model
//   userId: mongoose.Schema.Types.ObjectId;    // Reference to the User model
//   quantity: number;        // Quantity of the product ordered
//   address: string;         // Shipping address
//   size: string;            // Size of the product
//   color: string;           // Color of the product
//   status: string;          // Status of the order (Pending, Shipped, Delivered, Cancelled)
//   createdAt: Date;         // Date of order creation
//   amount: number;          // Total amount for the order
//   paymentMethod: string;   // Payment method: 'COD' or 'Online'
//   image:string;
// }

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}


interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

function Countinues() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Initially set to false
  const [addresses, setAddresses] = useState<string[]>([]); // State to hold user addresses
  const [selectedAddress, setSelectedAddress] = useState<string | undefined>(); // State for selected address
  const [newAddress, setNewAddress] = useState<string | undefined>(); // State for new address input
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const [subtotal, setSubtotal] = useState(0); // Example subtotal for product
  const [shippingCost, setShippingCost] = useState(59); // Example shipping cost
  const { user } = useUser()

  const [markprice, setmarkprice] = useState(0);

  const { id } = useParams();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Online'); // State for selected payment method

  const [userid, setuserid] = useState<string | null>(null);
  const [price, setprice] = useState(0)
  const [inStack, setInStack] = useState(false)
  const hasCheckedToken = useRef(false);



  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  // const [selectedImage, setSelectedImage] = useState<string | undefined>();



  const [selectedImage, setSelectedImage] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  // Find the product based on the id
  const [images, setImages] = useState<string[]>([]);


  const product = products.find((item) => item.id === Number(id));



  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (hasCheckedToken.current) return;
    hasCheckedToken.current = true;
    const token = localStorage.getItem('authToken'); // Retrieve token from local storage
    console.log('Token from localStorage:', token);

    // Redirect to login if no token is found
    if (!token) {
      alert('Please Login to purchase')
      console.log('No token found, redirecting to login...');
      router.push('/singin2');
      return;
    }



    try {
      loadRazorpayScript();
      // Decode the token to get the user information
      const decodedToken = jwt.decode(token) as { id: string; email: string; phone: string };

      // Check if token is valid or malformed
      if (!decodedToken || typeof decodedToken === 'string') {
        console.log('Invalid token, redirecting to login...');
        alert('Token Please Login to purchase product');
        router.push('/singin2');
        return;
      }

      // Check if token has expired
      const { exp } = decodedToken as JwtPayload;
      if (exp && exp * 1000 < Date.now()) {
        console.log('Token is expired, redirecting to login...');
        alert('Token is expired, redirecting to login...');
        router.push('/singin2');
        return;
      }

      // If token is valid, set authenticated state and fetch user data
      // setHasIdToken, user, isLoadingUser, userError

      if (token && (!user || !user.isVerified)) {
        alert("Please verify your email id by registering again.");
        router.push('/singin2');
        return;
      }


      setIsAuthenticated(true);

      setuserid(decodedToken.id);

      fetchUserAddresses(token); // Pass token to the address fetch function
      setShippingCost(59)
    } catch (error) {
      console.error('Error decoding token:', error);
      alert('Please login');
      router.push('/singin2'); // Redirect on error
    }
  }, []);

  const fetchUserAddresses = async (token: string) => {
    try {
      const response = await fetch('/api/addresses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User addresses:', data.user.addresses);

        // Update state with user data and addresses
        setAddresses(data.user.addresses); // Assuming setAddresses is defined in your component

      } else {
        console.error('Failed to fetch addresses:', await response.json());
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };


  useEffect(() => {
    if (product && product.colors.length > 0) {


      // Calculate subtotal based on the selected size's price
      if (selectedSize && selectedColor) {
        const selectedColorVariant = product.colors.find((colorVariant) => colorVariant.color === selectedColor);
        const selectedSizeVariant = selectedColorVariant?.sizes.find((sizeVariant) => sizeVariant.size === selectedSize);
        const selectedPrice = selectedSizeVariant ? selectedSizeVariant.price : product.sellingPrice;
        setmarkprice(selectedSizeVariant?.mprice || 0);
        setprice(selectedSizeVariant!.price)

        if (selectedSizeVariant!.images)
          setImages(selectedSizeVariant!.images)

        setSubtotal(quantity * selectedPrice + shippingCost);
      }
      else if (selectedColor) {
        const selectedColorVariant = product.colors.find((colorVariant) => colorVariant.color === selectedColor);
        setSelectedSize(selectedColorVariant?.sizes[0].size)
        const selectedSizeVariant = selectedColorVariant?.sizes.find((sizeVariant) => sizeVariant.size === selectedSize);
        const selectedPrice = selectedSizeVariant ? selectedSizeVariant.price : product.sellingPrice;
        setmarkprice(selectedSizeVariant?.mprice || 0);
        setprice(selectedSizeVariant!.price)

        setSubtotal(quantity * selectedPrice + shippingCost);
        if (selectedSizeVariant!.images)
          setImages(selectedSizeVariant!.images)
      }
      else {
        const firstColor = product.colors[0];

        if (firstColor.sizes.length > 0) {
          const firstSize = firstColor.sizes[0];

          setSelectedColor(firstColor.color); // Default to first color
          setSelectedSize(firstSize ? firstSize.size : ''); // Default to first size if available

          // setSelectedImage(firstSize.images && firstSize.images.length > 0 ? firstSize.images[0] : ''); // Set the default image from the first size if available
          setprice(firstSize.price); // Set the price for the selected size
          setInStack(firstSize.instock); // Set instock status for the selected size
          setmarkprice(selectedSizeVariant?.mprice || 0);
          setSubtotal(quantity * price + shippingCost);
          if (product.colors[0].sizes[0].images)
            setImages(product.colors[0].sizes[0].images)
        }
      }

    }
  }, [product]);

  if (!product) {
    return <div className="text-center text-red-500 font-bold text-xl m-auto">Product not found.</div>;
  }
  const handlePaymentSelection = (method: string) => {
    setSelectedPaymentMethod(method);
  };
  // setSubtotal(quantity*product?.sellingPrice+shippingCost)

  // const [loadings, setLoadings] = useState(false);

  const handleSizeChange = (product: Product, size: string, price: number, instock: boolean) => {
    const sizeVariant = product.colors.find(colorVariant => colorVariant.color === selectedColor)
      ?.sizes.find(sizeVariant => sizeVariant.size === size);

    if (sizeVariant) {
      setSelectedSize(size);
      // setSelectedImage(sizeVariant.images[0]); // Set first image for selected size
      setprice(price)
      setInStack(instock)
      setmarkprice(sizeVariant.mprice)
      // Log the new values after state updates
      console.log(`Selected Size: ${size}`);
      console.log(`Selected Image: ${sizeVariant.images[0]}`);
    } else {
      console.log(`No size variant found for size: ${size}`);
    }
  };

  const handleColorChange = (colorVariant: ColorVariant) => {
    setSelectedColor(colorVariant.color);

    // Log the color being set
    console.log(`Selected Color: ${colorVariant.color}`);

    if (colorVariant.sizes.length > 0) {
      // Set the first size as selected
      setSelectedSize(colorVariant.sizes[0].size);

      // Set the first image from the first size's images
      // setSelectedImage(colorVariant.sizes[0].images[0]);

      setInStack(colorVariant.sizes[0].instock)

      setmarkprice(colorVariant.sizes[0].mprice)
      // Log the new size and image after they have been set
      console.log(`Selected Size: ${colorVariant.sizes[0].size}`);
      console.log(`Selected Image: ${colorVariant.sizes[0].images[0]}`);
    } else {
      console.log('No sizes available for this color.');
    }
  };
  // const handleColorChange = (colorVariant: ColorVariant, product: Product) => {
  //   setSelectedColor(colorVariant.color); // Set the selected color

  //   // Assuming you want to set the first available size in the sizes array
  //   if (colorVariant.sizes.length > 0) {
  //     setSelectedSize(colorVariant.sizes[0].size); // Set the selected size
  //   } else {
  //     setSelectedSize(''); // Handle case where there are no sizes
  //   }

  //   // Assuming you want to set the first image in the images array of the first size
  //   if (colorVariant.sizes.length > 0 && colorVariant.sizes[0].images.length > 0) {
  //     setSelectedImage(colorVariant.sizes[0].images[0]); // Set the selected image
  //   } else {
  //     setSelectedImage(''); // Handle case where there are no images
  //   }

  // };
  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = Number(e.target.value); // Get the new quantity from the event
    setQuantity(newQuantity); // Update the quantity state

    // Calculate subtotal based on the new quantity and selected size price
    const selectedColorVariant = product.colors.find((colorVariant) => colorVariant.color === selectedColor);
    const selectedSizeVariant = selectedColorVariant?.sizes.find((sizeVariant) => sizeVariant.size === selectedSize);
    const selectedPrice = selectedSizeVariant ? selectedSizeVariant.price : product.sellingPrice;
    setmarkprice(selectedSizeVariant!.mprice)
    // Set the subtotal using the new quantity
    setSubtotal(newQuantity * selectedPrice + shippingCost);
  };

  const selectedColorVariant = product.colors.find((colorVariant) => colorVariant.color === selectedColor);

  // Find the currently selected size variant based on the selected color
  const selectedSizeVariant = selectedColorVariant?.sizes.find((sizeVariant) => sizeVariant.size === selectedSize);

  // Determine if the selected size variant is in stock; defaults to false if it doesn't exist
  const isSizeInStock = selectedSizeVariant?.instock || false;
  console.log("id", id)
  console.log()
  // Calculate total price
  const mprice = product ? markprice * quantity : 0;

  const sellingprice = price * quantity;
  const totalPrice = mprice + shippingCost;
  // Effect for checking authentication and fetching addresses






  // Handle adding a new address
  const handleAddAddress = async () => {
    if (newAddress) {
      // Update local state first



      // Send the new address to the backend
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Ensure the token is included in the request
        },
        body: JSON.stringify({ address: newAddress }), // Ensure address is correctly formatted
      });
      console.log('response', response)
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to add address:', errorData);
        setErrorMessage(errorData.message || 'An error occurred');
      } else {
        setAddresses((prev) => {
          // Check if newAddress already exists in the prev array
          const addressExists = prev.some(address => address === newAddress);

          if (!addressExists) {
            // If the address doesn't exist, add it to the state
            return [...prev, newAddress];
          } else {
            console.log('Address already exists');
            return prev; // Return the previous state if the address exists
          }
        });
        setSelectedAddress(newAddress);
        setNewAddress('')
        const data = await response.json();
        console.log('Address added successfully:', data.addresses); // Log the updated addresses
      }
    }

  };

  // Handle form submission or next step
  const handleProceed = async () => {
    setErrorMessage('')
    if (selectedAddress || newAddress) {

      if (selectedPaymentMethod == 'COD') {
        try {
          const response = await fetch('/api/addorder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: sellingprice,
              currency: 'INR',
              quantity: quantity,
              productId: id,
              paymenttype: selectedPaymentMethod,
              size: selectedSize,
              color: selectedColor,
              // image: selectedImage,
              image: '/data/t-shirt.jpg',
              userid: userid,
              address: selectedAddress,
              username: user!.username,
              email: user!.email
            }),
          });

          const data = await response.json(); // Await here to resolve the promise

          if (data.success) {
            console.log("redirected.......");
            router.push(`/success`);
          } else {
            alert('Order placement failed. Please try again.');
          }
        } catch (error) {
          alert('Order placement failed. Please try again.');
          console.log(error)
        }
      }
      else {
        // setLoadings(true);

        const scriptLoaded = await loadRazorpayScript();

        if (!scriptLoaded) {
          alert('Razorpay SDK failed to load. Are you online?');
          // setLoadings(false);
          return;
        }
        console.log("Razorpay APi")
        try {
          const response = await fetch('/api/razorpay', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              amount: sellingprice,
              currency: 'INR',
              quantity: quantity,
              productId: id,
              paymenttype: selectedPaymentMethod,
              size: selectedSize,
              color: selectedColor,
              // image: selectedImage,
              image: '/data/t-shirt.jpg',
              userid: userid,
              address: selectedAddress,
              username: user!.username,
              email: user!.email
            }),
          });

          const order = await response.json();
          console.log("order", order)
          if (!order || response.status !== 200) {
            alert('Server error. Please try again.');
            // setLoadings(false);
            return;
          }

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
            amount: order.amount,
            currency: order.currency,
            name: 'Home Articles',
            description: 'Test Transaction',
            order_id: order.id,
            handler: async function (response: RazorpayResponse) {
              // if(response.length==0)return <Loading/>
              router.push('/processing');
              console.log("this is payment verify section in continues pages")
              const data = await fetch('/api/paymentverify',
                {
                  method: "POST",
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,

                    amount: sellingprice,
                    currency: 'INR',
                    quantity: quantity,
                    productId: id,
                    paymenttype: selectedPaymentMethod,
                    size: selectedSize,
                    color: selectedColor,
                    // image: selectedImage,
                    image: '/data/t-shirt.jpg',
                    userid: userid,
                    address: selectedAddress,
                    username: user!.username,
                    email: user!.email
                  }),
                }
              )

              const res = await data.json();
              console.log("this is payment verify section in continues pages")
              console.log(res)
              console.log("response verify==", res)

              if (res.success) {
                console.log("redirected.......")
                router.push(`/success/${res.razorpay_payment_id}`)
              }



            },
            prefill: {
              name: "Home Articles",
              email: "homearticles@gmail.com",
              contact: "7017202818",
            },
            theme: {
              color: '#F37254',
            },
          };

          const paymentObject = new window.Razorpay(options);
          paymentObject.open();
        } catch (error) {
          alert('Payment failed. Please try again.');
          console.log(error)
        }

        // setLoadings(false);


      }
    }
    else {
      alert('Please select or add an address to proceed.')
      setErrorMessage('Please select or add an address to proceed.');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  console.log(isSizeInStock)

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

  return (
    <>

      <Head>
        <title>{`${product.name} - Home Articles`}</title>
        <meta name="description" content={`Buy ${product.name} on Home Articles. ${product.description}`} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${product.name} - Home Articles`} />
        <meta property="og:description" content={`Explore ${product.name} at Home Articles. ${product.description}`} />
        <meta property="og:url" content={`https://yourdomain.com/products/${product.id}`} />
        <meta property="og:image" content={product.image} />
        <meta property="og:type" content="product" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - Home Articles`} />
        <meta name="twitter:description" content={`Check out ${product.name} on Home Articles.`} />
        <meta name="twitter:image" content={product.image} />
      </Head>


      <div className="my-20 bg-black text-white p-10 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Select or Add Address</h2>

        {/* Dropdown to select existing addresses */}
        <div className="mb-4 flex justify-center">
          <select
            value={selectedAddress}
            onChange={(e) => {
              setSelectedAddress(e.target.value);
              setErrorMessage('');
            }}
            className="bg-gray-800 text-white p-3 text-lg rounded border border-gray-600 w-[60vw]"
          >
            <option value="">Select an address</option>
            {addresses.map((address) => (
              <option key={address} value={address}>
                {address}
              </option>
            ))}
          </select>
        </div>

        {/* Input field for adding a new address */}
        <h3 className="text-lg font-semibold mb-2">Add New Address:</h3>
        <div className='flex'>
        <input
          type="text"
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
          placeholder="Enter your new address"
          className="bg-gray-800 text-white p-2 rounded border border-gray-600 mb-2 w-[60vw] m-2"
        />
        <button
          onClick={handleAddAddress}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4 m-1"
        >
          Add New Address
        </button>
        </div>
      </div>
      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
      <div>
        {/* Error message */}

        

        <div className="my-10 flex justify-center items-center min-h-screen bg-dark-100">
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
                  </div><div className="mb-4">
              <div className="text-white">
                <ProductRate rate={product.ratings} count={product.reviews.length} className="text-white" />
              </div>
            </div>
            <p className="text-lg text-white-700 mb-4">{product.description}</p>

                  <div className="mb-6">
                    <span className="text-2xl font-bold text-white-600">₹ {price}</span>
                    <span className="line-through text-gray-400 ml-2">₹ {product.markPrice.toFixed(2)}</span>
                    <span className="text-green-500 ml-2">You Save: ₹ {(product.markPrice - price).toFixed(2)}</span>
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
                            onClick={() => handleSizeChange(product, size.size, size.price, size.instock)}
                            className={`border border-white-400 rounded-md py-2 px-4 text-sm font-medium text-white-800 ${selectedSize === size.size ? 'bg-teal-600 text-white' : ''}`}
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
                  {inStack ? <p className="text-green-500">In stock</p> : <p className="text-red-500">Out of stock</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Enhanced Price Details Section */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mb-6 w-[60vw] mx-auto">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-200">Price Details</h3>

        <div className="flex justify-between text-gray-400 text-lg mb-2">
          <span>Shipping</span>
          <span className="font-medium text-white">₹{shippingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-lg mb-2">
          <span>Price</span>
          <span className="text-white">₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-lg mb-2">
          <span>Discount</span>
          <span className="text-white">-₹{(totalPrice - sellingprice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-400 text-lg mb-2">
          <span>Subtotal</span>
          <span className="font-medium text-white">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t border-gray-600 pt-4">
          <span className="text-gray-100">Total Amount</span>
          <span className="text-white">₹{sellingprice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center">
        <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>
        <div className="flex items-center my-3">
          <input
            type="radio"
            id="online"
            name="paymentMethod"
            value="Online"
            className="mr-2"
            onChange={() => handlePaymentSelection('Online')}
          />
          <label htmlFor="online" className="text-lg">Online Payment</label>
        </div>
        <div className="flex items-center">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="COD"
            className="mr-2"
            onChange={() => handlePaymentSelection('COD')}
          />
          <label htmlFor="cod" className="text-lg">Cash on Delivery (COD)</label>
        </div>
      </div>


      {/* Proceed button */}
      {inStack && <div className="flex justify-center">
        <button
          onClick={handleProceed}
          className="bg-green-600 text-white py-4 px-10 rounded-full font-semibold text-lg hover:bg-green-700 my-10"
        >
          {selectedPaymentMethod == 'Online' ? <p>Make Payment</p> : <p>Place Order</p>}
        </button>
      </div>}
    </>
  );
}

export default Countinues;
