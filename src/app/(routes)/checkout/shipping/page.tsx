'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { MapPin, Truck, CreditCard } from 'lucide-react';

export default function ShippingPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    deliveryNotes: '',
  });
  
  // Fetch shipping fee from settings
  useEffect(() => {
    try {
      const settings = JSON.parse(localStorage.getItem('settings') || '{}');
      setShippingFee(settings.shippingFee || 0);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/login?returnUrl=/checkout/shipping');
    }
  }, [items.length, router]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!formData.fullName || !formData.phoneNumber || !formData.address || !formData.city || !formData.region) {
        throw new Error('Please fill in all required fields');
      }
      
      // Get user information
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Calculate totals
      const subtotal = getTotal();
      const tax = subtotal * 0.1;
      const total = subtotal + tax + shippingFee;

      // Create order object
      const order = {
        id: `ORD-${Date.now()}`,
        user_id: user.id,
        items: items.map(item => ({
          product_id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          total: item.product.price * item.quantity
        })),
        shipping: {
          ...formData
        },
        subtotal,
        shippingFee,
        tax,
        total,
        paymentMethod: 'Cash on Delivery',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      
      // Clear cart
      clearCart();
      
      // Redirect to confirmation page
      router.push(`/checkout/confirmation?orderId=${order.id}`);
    } catch (error: any) {
      alert(error.message || 'An error occurred during checkout');
      setIsSubmitting(false);
    }
  };
  
  // Calculate totals
  const subtotal = getTotal();
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shippingFee;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold">Shipping Information</h2>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                    Region/Province *
                  </label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className="w-full border rounded-md px-3 py-2"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Notes
                  </label>
                  <textarea
                    id="deliveryNotes"
                    name="deliveryNotes"
                    value={formData.deliveryNotes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border rounded-md px-3 py-2"
                    placeholder="Special instructions for delivery"
                  />
                </div>
              </div>
              
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold">Payment Method</h2>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cashOnDelivery"
                      name="paymentMethod"
                      value="cashOnDelivery"
                      checked
                      className="h-4 w-4 text-blue-600"
                      readOnly
                    />
                    <label htmlFor="cashOnDelivery" className="ml-2 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 ml-6">
                    Pay with cash when your order is delivered.
                  </p>
                </div>
                
                <div className="flex justify-between mt-8">
                  <Link href="/cart">
                    <Button variant="outline">
                      Back to Cart
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center py-2 border-b">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{(item.product.price * item.quantity).toFixed(3)} ر.ع</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Subtotal</p>
                <p>{subtotal.toFixed(3)} ر.ع</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Shipping</p>
                <p>{shippingFee.toFixed(3)} ر.ع</p>
              </div>
              <div className="flex justify-between text-sm">
                <p className="text-gray-600">Tax (10%)</p>
                <p>{tax.toFixed(3)} ر.ع</p>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <p>Total</p>
                  <p>{total.toFixed(3)} ر.ع</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <Truck className="h-5 w-5 text-blue-600 mr-2" />
                <p className="text-sm font-medium text-blue-800">Delivery Information</p>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Standard delivery: 3-5 business days
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}