'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/database.types';
import { useCartStore } from '@/lib/store';
import { getProductById, initializeStorage } from '@/lib/localStorage';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    // Initialize localStorage
    initializeStorage();

    setLoading(true);
    try {
      // Get product from localStorage
      const productData = getProductById(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <Image
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto object-cover"
            unoptimized={product.image_url?.startsWith('data:') || false}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-800">{product.price.toFixed(3)} ر.ع</p>
          <div className="border-t border-b py-4 my-4">
            <div className="text-gray-700 whitespace-pre-wrap">
              {product.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="quantity" className="font-medium">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-16 border rounded-md px-2 py-1"
            />
          </div>
          <Button onClick={handleAddToCart} className="mt-4">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
