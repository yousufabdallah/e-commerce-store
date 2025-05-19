'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShoppingBag,
  Package,
  ClipboardList,
  DollarSign,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    lowStockItems: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/auth/login?returnUrl=/admin');
        return;
      }

      try {
        const parsedUser = JSON.parse(userData);
        if (!parsedUser.isAdmin) {
          router.push('/');
          return;
        }

        setUser(parsedUser);

        // Fetch dashboard data from localStorage
        fetchDashboardData();
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoading(false);
      }
    }
  }, [router]);

  const fetchDashboardData = () => {
    try {
      // Get products from localStorage
      const products = JSON.parse(localStorage.getItem('e-commerce-products') || '[]');

      // Get orders from localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');

      // Get inventory from localStorage
      const inventory = JSON.parse(localStorage.getItem('e-commerce-inventory') || '[]');

      // Calculate low stock items (less than 5 quantity)
      const lowStock = inventory.filter((item: any) => item.quantity < 5);

      // Calculate total sales
      const totalSales = orders.reduce((sum: number, order: any) => sum + order.total, 0);

      // Get recent orders (last 5)
      const sortedOrders = [...orders].sort((a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const recent = sortedOrders.slice(0, 5);

      setStats({
        totalSales,
        totalOrders: orders.length,
        totalProducts: products.length,
        lowStockItems: lowStock.length,
      });

      setRecentOrders(recent);
      setLowStockProducts(lowStock);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalSales.toFixed(3)} ر.ع</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardList className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalOrders}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingBag className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalProducts}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.lowStockItems}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">View all</Button>
          </Link>
        </div>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading orders...</p>
            </div>
          ) : recentOrders.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{order.id}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'}`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {order.shipping?.fullName || 'Customer'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>{order.total.toFixed(3)} ر.ع</p>
                        <p className="ml-4">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center h-32">
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Products */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Low Stock Products</h2>
          <Link href="/admin/inventory">
            <Button variant="outline" size="sm">Manage Inventory</Button>
          </Link>
        </div>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <p>Loading inventory...</p>
            </div>
          ) : lowStockProducts.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {lowStockProducts.map((product) => (
                <li key={product.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {product.product_name || `Product ID: ${product.product_id}`}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Low Stock: {product.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Link href={`/admin/inventory/${product.id}`}>
                        <Button size="sm">Update Stock</Button>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center h-32">
              <p>No low stock items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
