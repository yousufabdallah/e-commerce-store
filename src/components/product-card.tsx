import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/database.types';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
        <Image
          src={product.image_url || '/placeholder.png'}
          alt={product.name}
          width={300}
          height={300}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          unoptimized={product.image_url?.startsWith('data:') || false}
        />
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/products/${product.id}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-900">{product.price.toFixed(3)} ر.ع</p>
          <Button onClick={handleAddToCart} size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
