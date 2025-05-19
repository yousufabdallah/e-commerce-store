'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, Lock } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        router.push(returnUrl);
      }
    }
  }, [router, returnUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        throw new Error('يرجى ملء جميع الحقول');
      }

      // Check for admin credentials first
      if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
        // Create admin user object
        const user = {
          id: 'admin-1',
          email: formData.email,
          name: 'Admin User',
          isAdmin: true,
          createdAt: new Date().toISOString(),
        };

        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to admin dashboard
        router.push('/admin');
        return;
      }

      // Check for registered users
      const credentials = JSON.parse(localStorage.getItem('credentials') || '[]');
      const userCredential = credentials.find((cred: any) => cred.email === formData.email);

      if (userCredential && userCredential.password === formData.password) {
        // Get user data
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userData = users.find((user: any) => user.id === userCredential.userId);

        if (userData) {
          // Save user to localStorage
          localStorage.setItem('user', JSON.stringify(userData));

          // Redirect to return URL
          router.push(returnUrl);
          return;
        }
      }

      // If we get here, login failed
      throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">تسجيل الدخول</h1>
          <p className="text-center text-gray-600 mb-6">أدخل بيانات حسابك للوصول إلى المتجر</p>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="أدخل كلمة المرور"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mb-4"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link href="/auth/register" className="text-blue-600 hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
