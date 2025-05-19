'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getSettings, updateSettings, initializeStorage } from '@/lib/localStorage';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: 'E-Commerce Store',
    storeEmail: 'info@example.com',
    storePhone: '+968 1234 5678',
    storeAddress: 'Muscat, Oman',
    currency: 'OMR',
    taxRate: 10,
    shippingFee: 2.500,
    enableRegistration: true,
    enableGuestCheckout: false,
    enableReviews: true,
    enableWishlist: false,
    enableComparisons: false,
    enableNotifications: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(settings);
  const [success, setSuccess] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    // Initialize localStorage if needed
    initializeStorage();

    // Get settings from localStorage
    const storedSettings = getSettings();
    if (storedSettings) {
      setSettings(storedSettings);
      setFormData(storedSettings);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save settings to localStorage
    updateSettings(formData);

    // Update local state
    setSettings(formData);
    setIsEditing(false);
    setSuccess(true);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Store Settings</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Settings
          </Button>
        )}
      </div>

      {success && (
        <div className="bg-green-50 text-green-500 p-4 rounded-md mb-6">
          Settings updated successfully!
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Store Information</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                      Store Name
                    </label>
                    <input
                      type="text"
                      id="storeName"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="storeEmail"
                      name="storeEmail"
                      value={formData.storeEmail}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="storePhone"
                      name="storePhone"
                      value={formData.storePhone}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      id="storeAddress"
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleChange}
                      rows={3}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment & Shipping</h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="w-full border rounded-md px-3 py-2"
                    >
                      <option value="OMR">Omani Rial (ر.ع)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                      <option value="GBP">British Pound (£)</option>
                      <option value="AED">UAE Dirham (د.إ)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      id="taxRate"
                      name="taxRate"
                      value={formData.taxRate}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping Fee (ر.ع)
                    </label>
                    <input
                      type="number"
                      id="shippingFee"
                      name="shippingFee"
                      value={formData.shippingFee}
                      onChange={handleChange}
                      min="0"
                      step="0.001"
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                <h2 className="text-lg font-medium text-gray-900 mt-6 mb-4">Features</h2>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableRegistration"
                      name="enableRegistration"
                      checked={formData.enableRegistration}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enableRegistration" className="ml-2 block text-sm text-gray-700">
                      Enable user registration
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableGuestCheckout"
                      name="enableGuestCheckout"
                      checked={formData.enableGuestCheckout}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enableGuestCheckout" className="ml-2 block text-sm text-gray-700">
                      Enable guest checkout
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableReviews"
                      name="enableReviews"
                      checked={formData.enableReviews}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enableReviews" className="ml-2 block text-sm text-gray-700">
                      Enable product reviews
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableWishlist"
                      name="enableWishlist"
                      checked={formData.enableWishlist}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enableWishlist" className="ml-2 block text-sm text-gray-700">
                      Enable wishlist feature
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableComparisons"
                      name="enableComparisons"
                      checked={formData.enableComparisons}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enableComparisons" className="ml-2 block text-sm text-gray-700">
                      Enable product comparisons
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="enableNotifications"
                      name="enableNotifications"
                      checked={formData.enableNotifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="enableNotifications" className="ml-2 block text-sm text-gray-700">
                      Enable email notifications
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(settings);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Settings
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Store Information</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Store Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{settings.storeName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{settings.storeEmail}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{settings.storePhone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{settings.storeAddress}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment & Shipping</h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Currency</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {settings.currency === 'OMR' ? 'Omani Rial (ر.ع)' :
                       settings.currency === 'USD' ? 'US Dollar ($)' :
                       settings.currency === 'EUR' ? 'Euro (€)' :
                       settings.currency === 'GBP' ? 'British Pound (£)' :
                       settings.currency === 'AED' ? 'UAE Dirham (د.إ)' : settings.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Tax Rate</dt>
                    <dd className="mt-1 text-sm text-gray-900">{settings.taxRate}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Shipping Fee</dt>
                    <dd className="mt-1 text-sm text-gray-900">{settings.shippingFee} ر.ع</dd>
                  </div>
                </dl>

                <h2 className="text-lg font-medium text-gray-900 mt-6 mb-4">Features</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${settings.enableRegistration ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm text-gray-700">User registration is {settings.enableRegistration ? 'enabled' : 'disabled'}</span>
                  </li>
                  <li className="flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${settings.enableGuestCheckout ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm text-gray-700">Guest checkout is {settings.enableGuestCheckout ? 'enabled' : 'disabled'}</span>
                  </li>
                  <li className="flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${settings.enableReviews ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm text-gray-700">Product reviews are {settings.enableReviews ? 'enabled' : 'disabled'}</span>
                  </li>
                  <li className="flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${settings.enableWishlist ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm text-gray-700">Wishlist feature is {settings.enableWishlist ? 'enabled' : 'disabled'}</span>
                  </li>
                  <li className="flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${settings.enableComparisons ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm text-gray-700">Product comparisons are {settings.enableComparisons ? 'enabled' : 'disabled'}</span>
                  </li>
                  <li className="flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full ${settings.enableNotifications ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                    <span className="text-sm text-gray-700">Email notifications are {settings.enableNotifications ? 'enabled' : 'disabled'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
