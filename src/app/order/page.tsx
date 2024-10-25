'use client';
import { useUser } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

type Order = {
  orderId: string;
  paymentId: string;
  signature: string;
  productId: number;
  quantity: number;
  address: string;
  size: string;
  color: string;
  status: string;
  createdAt: string;
  amount: number;
  paymentMethod: string;
  username: string;
  email: string;
  image: string;
  CartItem?: {
    id: number;
    quantity: number;
    color: string;
    size: string;
    price: number;
  }[];
};

function Order() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      return;
    }

    const userId = user.email;
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/order?userId=${userId}`);
        const data = await response.json();
        if (response.ok && data.success) {
          setOrders(data.orders);
        } else {
          setError(data.message || 'Failed to fetch order details');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('An error occurred while fetching the order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-20 flex items-center justify-center content-center">
    {user ? (
      <div className="bg-black p-4 rounded-lg shadow-lg w-full">
        {orders.length > 0 && (
          <h1 className="font-bold mb-4 text-center text-lg md:text-2xl lg:text-3xl text-white">Your Orders</h1>
        )}
        {orders.length > 0 ? (
          orders.map((singleOrder, index) => (
            <div key={index} className="mb-6">
              {singleOrder.CartItem && singleOrder.CartItem.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {singleOrder.CartItem.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row bg-white border rounded-lg shadow-md overflow-hidden w-full">
                      <div className="flex-shrink-0">
                        <Image
                          src={'/data/t-shirt.jpg'}
                          alt="Product Image"
                          width={130}
                          height={130}
                          className="object-cover w-full md:w-40 h-40"
                        />
                      </div>
                      <div className="p-4 flex-1">
                        <div className="mt-2 space-y-2">
                          <p className="text-black text-sm md:text-base"><strong>Order ID:</strong> {singleOrder.orderId}</p>
                          <p className="text-black text-sm md:text-base"><strong>Quantity:</strong> {item.quantity}</p>
                          <p className="text-black text-sm md:text-base"><strong>Address:</strong> {singleOrder.address}</p>
                          <p className="text-black text-sm md:text-base"><strong>Size:</strong> {item.size}</p>
                          <p className="text-black text-sm md:text-base"><strong>Color:</strong> {item.color}</p>
                          <p className="text-black text-sm md:text-base"><strong>Order Date:</strong> {new Date(singleOrder.createdAt).toLocaleDateString()}</p>
                          <p className="text-black text-sm md:text-base"><strong>Total Amount:</strong> ${singleOrder.amount}</p>
                          <p className="text-black text-sm md:text-base"><strong>Payment Method:</strong> {singleOrder.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col md:flex-row bg-white border rounded-lg shadow-md overflow-hidden w-full">
                  <div className="flex-shrink-0">
                    <Image
                      src={'/data/t-shirt.jpg'}
                      alt={`Product Image for ${singleOrder.productId}`}
                      width={130}
                      height={130}
                      className="object-cover w-full md:w-40 h-40"
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="mt-2 space-y-2">
                      <p className="text-black text-sm md:text-base"><strong>Order ID:</strong> {singleOrder.orderId}</p>
                      <p className="text-black text-sm md:text-base"><strong>Quantity:</strong> {singleOrder.quantity}</p>
                      <p className="text-black text-sm md:text-base"><strong>Address:</strong> {singleOrder.address}</p>
                      <p className="text-black text-sm md:text-base"><strong>Size:</strong> {singleOrder.size}</p>
                      <p className="text-black text-sm md:text-base"><strong>Color:</strong> {singleOrder.color}</p>
                      <p className="text-black text-sm md:text-base"><strong>Status:</strong> {singleOrder.status}</p>
                      <p className="text-black text-sm md:text-base"><strong>Order Date:</strong> {new Date(singleOrder.createdAt).toLocaleDateString()}</p>
                      <p className="text-black text-sm md:text-base"><strong>Total Amount:</strong> ${singleOrder.amount}</p>
                      <p className="text-black text-sm md:text-base"><strong>Payment Method:</strong> {singleOrder.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-white text-center">No orders found</p>
        )}
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-lg md:text-xl text-gray-600 mb-6">Please log in to see your orders</p>
      </div>
    )}
  </div>
)
}

export default Order;
