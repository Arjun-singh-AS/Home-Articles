'use client'
import { User } from '@/model/User';
import mongoose from 'mongoose';
import {useRouter} from 'next/navigation';
import { useState } from 'react';
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

interface Order{
  orderId: string;         // Unique identifier for the order
  productId: mongoose.Schema.Types.ObjectId; // Reference to the Product model
  userId: mongoose.Schema.Types.ObjectId;    // Reference to the User model
  quantity: number;        // Quantity of the product ordered
  address: string;         // Shipping address
  size: string;            // Size of the product
  color: string;           // Color of the product
  status: string;          // Status of the order (Pending, Shipped, Delivered, Cancelled)
  createdAt: Date;        // Date of order creation
  amount:number;
  image:string;
}
interface CheckoutProps {
  ord: Order;
  user: User;
}

export default function Checkout({ ord, user }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/razorpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: ord.amount, currency: 'INR' }),
      });

      const order = await response.json();

      if (!order || response.status !== 200) {
        alert('Server error. Please try again.');
        setLoading(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || " ",
        amount: order.amount,
        currency: order.currency,
        name: 'Your Website Name',
        description: 'Test Transaction',
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          // if(response.length==0)return <Loading/>
          const data=await fetch('/api/paymentverify',
            {
              method:"POST",
              headers: {'Content-Type': 'application/json'},
              body:JSON.stringify({
                razorpay_payment_id:response.razorpay_payment_id,
                razorpay_order_id:response.razorpay_order_id,
                razorpay_signature:response.razorpay_signature,
              }),
            }
          );
          
          const res = await data.json();

          console.log("response verify==",res)
  
          if(res?.message=="success")
          {
  
  
            console.log("redirected.......")
            router.push("/paymentsuccess?paymentid="+response.razorpay_payment_id)
  
          }



        },
        prefill: {
          name: user.username,
          email: user.email,
          contact: user.phone,
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

    setLoading(false);
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? 'Processing...' : `Pay ₹${ord.amount / 100}`}
      </button>
    </div>
  );
}
