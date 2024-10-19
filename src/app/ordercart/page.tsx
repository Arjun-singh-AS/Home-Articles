'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload to properly type decoded tokens
// import { useParams } from 'next/navigation';
import { useCart } from '../../context/CartContext';
// import ProductRate from '../../components/ProductRate';
import { useProducts } from '@/context/ProductContext';
import jwt from 'jsonwebtoken';
import { useUser } from '@/context/UserContext';
import Image from 'next/image';


declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
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

function OrderCart() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Initially set to false
    const [addresses, setAddresses] = useState<string[]>([]); // State to hold user addresses
    const [selectedAddress, setSelectedAddress] = useState<string | undefined>(); // State for selected address
    const [newAddress, setNewAddress] = useState<string | undefined>(); // State for new address input

    const [errorMessage, setErrorMessage] = useState<string | undefined>(); // State for error message
    // const [subtotal, setSubtotal] = useState(0); // Example subtotal for product
    // const [shippingCost, setShippingCost] = useState(59); // Example shipping cost
    const { user} = useUser()
    // const [loadings, setLoadings] = useState(false);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Online'); // State for selected payment method
    const [userid, setuserid] = useState<string | null>(null);
    // const [price, setprice] = useState(0)
    // const [inStack, setInStack] = useState(false)
    const hasCheckedToken = useRef(false);
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const { products } = useProducts();

    const handlePaymentSelection = (method: string) => {
        setSelectedPaymentMethod(method);
    };

    const cartWithProductDetails = cartItems.map(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        return {
          ...cartItem,
          product, // Attach full product details
          total: (cartItem.price || 0) * cartItem.quantity, // Calculate total for this item
        };
      });
    
      // Calculate overall total
      const overallTotal = cartWithProductDetails.reduce((total, cartItem) => total + (cartItem.total || 0), 0);
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
                alert('Decoded Token Please Login to purchase product');
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

    const handleProceed = async () => {
        setErrorMessage('')
        if (selectedAddress || newAddress) {
    
          if (selectedPaymentMethod == 'COD') {
            try {
              const response = await fetch('/api/addordercart', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  currency: 'INR',
                  paymenttype: selectedPaymentMethod,
                  userid: userid,
                  address: selectedAddress,
                  username: user!.username,
                  email: user!.email,
                  cartItems,
                  overallTotal:overallTotal.toFixed(2)
                }),
              });
              
              const data = await response.json(); // Await here to resolve the promise
        
          if (data.success) {
            console.log("redirected.......");
            router.push(`/success`);
          } else {
            alert('Order placement failed. Please try again.');
          }
    
            }
            catch (error) {
              alert('Order Placed failed. Please try again.');
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
              const response = await fetch('/api/razorpaycart', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({

                  cartItems,
                  overallTotal:overallTotal.toFixed(2),
                  currency: 'INR',
                  paymenttype: selectedPaymentMethod,
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
                  const data = await fetch('/api/paymentcartverify',
                    {
                      method: "POST",
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature,
                    currency: 'INR',
                    paymenttype: selectedPaymentMethod,
                    userid: userid,
                    address: selectedAddress,
                    username: user!.username,
                    email: user!.email,
                    cartItems,
                    overallTotal:overallTotal.toFixed(2)

                      }),
                    }
                  );
    
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
              alert(`Payment failed. Please try again.${error}`);
            }
    
            // setLoadings(false);
    
    
          }
  
        }
        else {
          alert('Please select or add an address to proceed.')
          setErrorMessage('Please select or add an address to proceed.');
          console.log(errorMessage)
        }
      };

    if (!isAuthenticated) {
        return null;
    }


    return (
        <>

            <div className="bg-black text-white min-h-screen p-4 flex flex-col items-center justify-center">
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
                <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Enter your new address"
                    className="bg-gray-800 text-white p-2 rounded border border-gray-600 mb-2 w-[60vw]"
                />
                <button
                    onClick={handleAddAddress}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-4"
                >
                    Add Address
                </button>
            </div>

            
            <div className="container mx-auto my-20 py-10 max-w-[80%]"> {/* Limit width to 80% and center */}
      <div className="flex justify-center mb-4">
        <h2 className="text-2xl font-bold text-white-800">Your Cart</h2>
      </div>
      {cartWithProductDetails.length === 0 ? (
        <p className="text-lg text-gray-800 text-center">Your cart is empty</p>
      ) : (
        <ul className="space-y-4">
          {cartWithProductDetails.map((cartItem) => (
            <li key={`${cartItem.id}-${cartItem.color}-${cartItem.size}`} className="flex items-center bg-white p-4 rounded shadow-md">
              <Image
  src="/images/t-shirt.jpg" // Correct path from the public directory
  alt={cartItem.product?.name || "T-shirt"}
  width={30}
  height={40}
  className="w-30 h-40 object-cover rounded"
/>
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{cartItem.product?.name}</h3>
                <p className="text-sm text-gray-800">Color: {cartItem.color}</p>
                <p className="text-sm text-gray-800">Size: {cartItem.size}</p>
                <p className="mt-1 text-md font-medium text-gray-800">Price: ${cartItem.price}</p>
                <p className="mt-1 text-md font-medium text-gray-800">Total: ${cartItem.total.toFixed(2)}</p> {/* Total value for this product */}
                <p className="mt-2 text-sm text-gray-800">{cartItem.product?.description}</p>
              </div>
              <div className="flex items-center ml-4">
                <button
                  onClick={() => updateQuantity(cartItem.id, cartItem.color, cartItem.size, cartItem.quantity - 1)}
                  className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                  disabled={cartItem.quantity === 1}
                >
                  -
                </button>
                <span className="mx-4 text-lg text-gray-800">{cartItem.quantity}</span>
                <button
                  onClick={() => updateQuantity(cartItem.id, cartItem.color, cartItem.size, cartItem.quantity + 1)}
                  className="bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400"
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(cartItem.id, cartItem.color, cartItem.size)}
                  className="mx-5 bg-red-500 text-white p-2 rounded hover:bg-red-600 ml-4"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {cartWithProductDetails.length > 0 && (
        <div className="mt-6 text-lg font-bold text-white-800 text-right flex justify-center mb-4">
          Overall Total: ${overallTotal.toFixed(2)} {/* Display overall total */}
        </div>

      )}
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
            <div className="flex justify-center">
                <button
                      onClick={handleProceed}
                    className="bg-green-600 text-white py-4 px-10 rounded-full font-semibold text-lg hover:bg-green-700 my-10"
                >
                    {selectedPaymentMethod == 'Online' ? <p>Make Payment</p> : <p>Place Order</p>}
                </button>
            </div>
        </>
    );
};

export default OrderCart;
