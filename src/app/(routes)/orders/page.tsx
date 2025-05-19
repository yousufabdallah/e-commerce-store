'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/auth/login?returnUrl=/orders');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Get orders from localStorage
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');

        // Filter orders for current user
        // يجب أن يكون الحقل user_id وليس userId
        const userOrders = allOrders.filter((order: any) => order.user_id === parsedUser.id);

        // Sort orders by date (newest first)
        userOrders.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-semibold">No orders found</h2>
        <p className="mt-2 text-gray-500">You haven't placed any orders yet.</p>
        <Link href="/products">
          <Button className="mt-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-500 mr-2" />
                    <h2 className="text-lg font-semibold">Order #{order.id.split('-')[1]}</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="font-medium">{order.items.length} {order.items.length === 1 ? 'product' : 'products'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">{order.total.toFixed(3)} ر.ع</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Shipping Address</p>
                    <p className="font-medium">{order.shipping.city}, {order.shipping.region}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="font-medium">{order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-gray-700">Order Items</h3>
                {order.items.slice(0, 2).map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{item.total.toFixed(3)} ر.ع</p>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-sm text-gray-500">
                    +{order.items.length - 2} more {order.items.length - 2 === 1 ? 'item' : 'items'}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Link href={`/checkout/confirmation?orderId=${order.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
