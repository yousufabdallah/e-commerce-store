'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);

  // Fetch shipping fee from settings
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      setShippingFee(settings.shippingFee || 0);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  const handleCheckout = async () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('user') !== null;

    if (!isLoggedIn) {
      // Redirect to login page with return URL
      window.location.href = `/auth/login?returnUrl=${encodeURIComponent('/cart')}`;
      return;
    }

    setIsCheckingOut(true);

    // Redirect to shipping information page
    window.location.href = '/checkout/shipping';
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-gray-500">Looks like you haven't added any products to your cart yet.</p>
        <Link href="/products">
          <Button className="mt-8">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row border-b pb-6">
                  <div className="sm:w-24 sm:h-24 flex-shrink-0 mb-4 sm:mb-0">
                    <Image
                      src={item.product.image_url || '/placeholder.png'}
                      alt={item.product.name}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 sm:ml-6">
                    <div className="flex justify-between">
                      <Link href={`/products/${item.product.id}`} className="text-lg font-medium text-gray-900 hover:text-blue-600">
                        {item.product.name}
                      </Link>
                      <p className="text-lg font-medium text-gray-900">
                        {(item.product.price * item.quantity).toFixed(3)} ر.ع
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.product.price.toFixed(3)} ر.ع لكل قطعة</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.product.id}`} className="mr-2 text-sm text-gray-600">
                          Qty:
                        </label>
                        <input
                          type="number"
                          id={`quantity-${item.product.id}`}
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                          className="w-16 border rounded-md px-2 py-1"
                        />
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="font-medium">{getTotal().toFixed(3)} ر.ع</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="font-medium">{shippingFee.toFixed(3)} ر.ع</p>
              </div>
              <div className="flex justify-between">
                <p className="text-gray-600">Tax</p>
                <p className="font-medium">{(getTotal() * 0.1).toFixed(3)} ر.ع</p>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <p>{(getTotal() * 1.1 + shippingFee).toFixed(3)} ر.ع</p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full mt-6"
            >
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
            <Link href="/products">
              <Button variant="outline" className="w-full mt-4">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
