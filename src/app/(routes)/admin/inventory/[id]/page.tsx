'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Edit, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getInventoryById, getProductById, updateInventory, initializeStorage } from '@/lib/localStorage';

export default function InventoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const inventoryId = params.id as string;

  const [inventory, setInventory] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch inventory and product data
  useEffect(() => {
    // Initialize localStorage
    initializeStorage();

    try {
      // Get inventory from localStorage
      const inventoryData = getInventoryById(inventoryId);

      if (inventoryData) {
        setInventory(inventoryData);
        setQuantity(inventoryData.quantity);

        // Get product from localStorage
        const productData = getProductById(inventoryData.product_id);

        if (productData) {
          setProduct(productData);
        } else {
          throw new Error('Product not found');
        }
      } else {
        throw new Error('Inventory not found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  }, [inventoryId]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value) || 0);
  };

  const handleUpdateInventory = () => {
    setError(null);
    setSuccess(false);
    setUpdating(true);

    try {
      // Update inventory in localStorage
      const updatedInventory = updateInventory(inventoryId, {
        quantity,
        updated_at: new Date().toISOString(),
      });

      if (!updatedInventory) {
        throw new Error('Failed to update inventory');
      }

      setSuccess(true);

      // Update local state
      setInventory((prev: any) => ({
        ...prev,
        quantity,
        updated_at: new Date().toISOString(),
      }));

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating inventory');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading inventory data...</p>
      </div>
    );
  }

  if (!inventory || !product) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-md">
        <p>Inventory or product not found</p>
        <Button
          onClick={() => router.push('/admin/inventory')}
          className="mt-4"
        >
          Back to Inventory
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push('/admin/inventory')}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6">
          Inventory updated successfully!
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.image_url || '/placeholder.png'}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                  unoptimized={product.image_url?.startsWith('data:') || false}
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <Link href={`/admin/products/edit/${product.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Product
                  </Button>
                </Link>
              </div>

              <p className="text-gray-600 mt-2">{product.description}</p>

              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium">${product.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category ID</p>
                    <p className="font-medium">{product.category_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Product ID</p>
                    <p className="font-medium">{product.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium">{new Date(inventory.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Update Inventory</h3>
                <div className="flex items-center">
                  <div className="mr-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Stock
                    </label>
                    <input
                      type="number"
                      id="quantity"
                      min="0"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-32 border rounded-md px-3 py-2"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateInventory}
                    disabled={updating || quantity === inventory.quantity}
                    className="mt-6"
                  >
                    {updating ? 'Updating...' : 'Update Stock'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
