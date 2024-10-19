'use client';
import { useUser } from '@/context/UserContext';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

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
    <div className="m-20 flex items-center justify-center content-center">
  {user ? (
    <div className="bg-black p-4 rounded-lg shadow-lg w-full max-w-md">
      {orders.length > 0 && <h1 className="font-bold mb-4 text-center">Your Orders</h1>}
      {orders.length > 0 ? (
        orders.map((singleOrder, index) => (
          <div key={index} className="mb-6 flex flex-col bg-white border rounded-lg shadow-md overflow-hidden w-100">
            {singleOrder.CartItem && singleOrder.CartItem.length > 0 ? (
              <div className="mt-4">
                <h2 className="font-bold mb-2 text-center">Cart Items</h2>
                {singleOrder.CartItem.map((item, idx) => (
                  <div key={idx} className="border p-4 mb-2 rounded-md text-black">
                    <p><strong>Product ID:</strong> {item.id}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Color:</strong> {item.color}</p>
                    <p><strong>Size:</strong> {item.size}</p>
                    <p><strong>Price:</strong> ${item.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Image
                  src={singleOrder.image || 'data/t-shirt.jpg'}
                  alt={`Product Image for ${singleOrder.productId}`}
                  className="w-30 h-40 object-cover"
                />
                <div className="p-4 flex-1">
                  <div className="mt-2">
                    <p className="text-black"><strong>Order ID:</strong> {singleOrder.orderId}</p>
                    <p className="text-black"><strong>Quantity:</strong> {singleOrder.quantity}</p>
                    <p className="text-black"><strong>Address:</strong> {singleOrder.address}</p>
                    <p className="text-black"><strong>Size:</strong> {singleOrder.size}</p>
                    <p className="text-black"><strong>Color:</strong> {singleOrder.color}</p>
                    <p className="text-black"><strong>Status:</strong> {singleOrder.status}</p>
                    <p className="text-black"><strong>Order Date:</strong> {new Date(singleOrder.createdAt).toLocaleDateString()}</p>
                    <p className="text-black"><strong>Total Amount:</strong> ${singleOrder.amount}</p>
                    <p className="text-black"><strong>Payment Method:</strong> {singleOrder.paymentMethod}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>No orders found</p>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h2>
      <p className="text-lg text-gray-600 mb-6">Please login to see your orders</p>
    </div>
  )}
</div>
  );
}

export default Order;
