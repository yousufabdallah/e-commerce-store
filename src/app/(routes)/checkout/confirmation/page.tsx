'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Truck, Package, Clock } from 'lucide-react';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }
    
    try {
      // Get orders from localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o: any) => o.id === orderId);
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Order not found</p>
        <Link href="/">
          <Button className="mt-4">
            Return to Home
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your order. Your order has been received and is being processed.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order #{order.id.split('-')[1]}</h2>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                {order.status}
              </span>
            </div>
            
            <div className="border-t border-b py-4 my-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Order Date:</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Payment Method:</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping Address:</p>
                <p className="font-medium text-right">
                  {order.shipping.address}, {order.shipping.city}<br />
                  {order.shipping.region} {order.shipping.postalCode}
                </p>
              </div>
            </div>
            
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3 mb-6">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{item.total.toFixed(3)} ر.ع</p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Subtotal:</p>
                <p>{order.subtotal.toFixed(3)} ر.ع</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Shipping:</p>
                <p>{order.shippingFee.toFixed(3)} ر.ع</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Tax:</p>
                <p>{order.tax.toFixed(3)} ر.ع</p>
              </div>
              <div className="flex justify-between font-semibold text-lg mt-2">
                <p>Total:</p>
                <p>{order.total.toFixed(3)} ر.ع</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>
            
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              <div className="relative flex items-start mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full mr-4 z-10">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Order Confirmed</h3>
                  <p className="text-sm text-gray-500">Your order has been received</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="relative flex items-start mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full mr-4 z-10">
                  <Package className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium">Processing</h3>
                  <p className="text-sm text-gray-500">Your order is being prepared</p>
                  <p className="text-xs text-gray-400">Estimated: {new Date(new Date(order.createdAt).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="relative flex items-start mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full mr-4 z-10">
                  <Truck className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium">Out for Delivery</h3>
                  <p className="text-sm text-gray-500">Your order is on its way</p>
                  <p className="text-xs text-gray-400">Estimated: {new Date(new Date(order.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="relative flex items-start">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full mr-4 z-10">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-medium">Delivered</h3>
                  <p className="text-sm text-gray-500">Estimated delivery date</p>
                  <p className="text-xs text-gray-400">{new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Link href="/orders">
            <Button variant="outline">
              View All Orders
            </Button>
          </Link>
          <Link href="/products">
            <Button>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
