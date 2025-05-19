'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { User, Mail, Lock, Phone, MapPin } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        throw new Error('يرجى ملء جميع الحقول المطلوبة');
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error('كلمات المرور غير متطابقة');
      }

      if (formData.password.length < 6) {
        throw new Error('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل');
      }

      // Check if email is already in use
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = existingUsers.some((user: any) => user.email === formData.email);

      if (emailExists) {
        throw new Error('البريد الإلكتروني مستخدم بالفعل');
      }

      // Create user object
      const userId = `user-${Date.now()}`;
      const user = {
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        createdAt: new Date().toISOString(),
      };

      // Save user to localStorage
      existingUsers.push(user);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      // Create user credentials (in a real app, you would hash the password)
      const credentials = {
        email: formData.email,
        password: formData.password,
        userId: userId,
      };

      // Save credentials to localStorage
      const existingCredentials = JSON.parse(localStorage.getItem('credentials') || '[]');
      existingCredentials.push(credentials);
      localStorage.setItem('credentials', JSON.stringify(existingCredentials));

      // Log in the user
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to return URL
      router.push(returnUrl);
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
          <h1 className="text-2xl font-bold mb-6 text-center">إنشاء حساب جديد</h1>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
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

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور *
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
              <p className="text-xs text-gray-500 mt-1">يجب أن تتكون كلمة المرور من 6 أحرف على الأقل</p>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="أعد إدخال كلمة المرور"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                رقم الهاتف
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="أدخل رقم هاتفك"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                العنوان
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full pl-10 pr-3 py-2 border rounded-md"
                  placeholder="أدخل عنوانك"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mb-4"
            >
              {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
