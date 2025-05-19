'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, Inventory, Category } from '@/types/database.types';
import { getProducts, getInventory, getCategories, updateInventory, initializeStorage } from '@/lib/localStorage';

interface InventoryItem extends Inventory {
  product: Product;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const lowStockThreshold = 5;

  useEffect(() => {
    // Initialize localStorage
    initializeStorage();

    setLoading(true);
    try {
      // Get products and inventory from localStorage
      const productsData = getProducts();
      const inventoryData = getInventory();

      // Combine inventory with product data
      const inventoryWithProducts = inventoryData.map(item => {
        const product = productsData.find(p => p.id === item.product_id);
        if (!product) {
          return null; // Skip if product not found
        }
        return {
          ...item,
          product
        };
      }).filter(Boolean) as InventoryItem[];

      setInventory(inventoryWithProducts);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLowStock = showLowStock ? item.quantity < lowStockThreshold : true;
    return matchesSearch && matchesLowStock;
  });

  const handleUpdateInventory = (id: string, quantity: number) => {
    try {
      // Update inventory in localStorage
      const updated = updateInventory(id, { quantity, updated_at: new Date().toISOString() });

      if (!updated) {
        throw new Error('Failed to update inventory');
      }

      // Update local state for immediate UI feedback
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity, updated_at: new Date().toISOString() } : item
        )
      );
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
        <Link href="/admin/inventory/add">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="lowStock"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="lowStock" className="ml-2 block text-sm text-gray-900">
            Show Low Stock Only
          </label>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 flex justify-center">
          <p>Loading inventory...</p>
        </div>
      ) : (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 relative">
                        <Image
                          src={item.product.image_url || '/placeholder.png'}
                          alt={item.product.name}
                          fill
                          className="rounded-md object-cover"
                          unoptimized={item.product.image_url?.startsWith('data:') || false}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.quantity < lowStockThreshold ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Low Stock
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        In Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(item.updated_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleUpdateInventory(item.id, parseInt(e.target.value))}
                        className="w-16 border rounded-md px-2 py-1"
                      />
                      <Link href={`/admin/inventory/${item.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
