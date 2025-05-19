'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getCategoryById, updateCategory } from '@/lib/localStorage';

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch category when component mounts
  useEffect(() => {
    try {
      // Get category from localStorage
      const category = getCategoryById(categoryId);

      if (category) {
        setFormData({
          name: category.name,
          description: category.description || '',
        });
      } else {
        setError('Category not found');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Failed to load category data');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.name) {
        throw new Error('Category name is required');
      }

      // Update category in localStorage
      const updatedCategory = updateCategory(categoryId, {
        name: formData.name,
        description: formData.description,
      });

      if (!updatedCategory) {
        throw new Error('Failed to update category');
      }

      setSuccess(true);

      // Redirect to categories page after 2 seconds
      setTimeout(() => {
        router.push('/admin/categories');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while updating the category');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading category data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Category</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6">
          Category updated successfully! Redirecting...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
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

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/categories')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Category'}
          </Button>
        </div>
      </form>
    </div>
  );
}
