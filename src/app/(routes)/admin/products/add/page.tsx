'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { getCategories, addProduct, initializeStorage } from '@/lib/localStorage';

export default function AddProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category_id: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize localStorage and fetch categories when component mounts
  useEffect(() => {
    // Initialize localStorage with sample data if empty
    initializeStorage();

    // Fetch categories from localStorage
    const categoriesData = getCategories();
    setCategories(categoriesData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name || !formData.description || !formData.price || !formData.category_id) {
        throw new Error('Please fill in all required fields');
      }

      // Convert price to number
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }

      // Add product to localStorage
      const newProduct = addProduct({
        name: formData.name,
        description: formData.description,
        price,
        image_url: formData.image_url || '/placeholder.png',
        category_id: formData.category_id,
      });

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        image_url: '',
        category_id: '',
      });

      // Redirect to products page after 2 seconds
      setTimeout(() => {
        router.push('/admin/products');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while adding the product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add New Product</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6">
          Product added successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Product Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-md px-3 py-2"
            required
            placeholder="Enter product description. Use new lines to create paragraphs."
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (ر.ع) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            step="0.001"
            min="0"
            className="w-full border rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Image
          </label>
          <ImageUpload
            onImageUpload={(imageUrl) => {
              setFormData(prev => ({ ...prev, image_url: imageUrl }));
            }}
            currentImage={formData.image_url || '/placeholder.png'}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/products')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
