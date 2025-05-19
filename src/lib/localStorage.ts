// Types
import { Product, Category, Inventory, Order, OrderItem, User } from '@/types/database.types';

// Keys for localStorage
const KEYS = {
  PRODUCTS: 'e-commerce-products',
  CATEGORIES: 'e-commerce-categories',
  INVENTORY: 'e-commerce-inventory',
  ORDERS: 'e-commerce-orders',
  ORDER_ITEMS: 'e-commerce-order-items',
  USERS: 'e-commerce-users',
  CARTS: 'e-commerce-carts',
  CART_ITEMS: 'e-commerce-cart-items',
  SETTINGS: 'settings',
};

// Helper function to generate UUID
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to get data from localStorage
const getFromStorage = <T>(key: string): T[] => {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error getting data from localStorage for key ${key}:`, error);
    return [];
  }
};

// Helper function to save data to localStorage
const saveToStorage = <T>(key: string, data: T[]): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving data to localStorage for key ${key}:`, error);
  }
};

// Initialize localStorage (with sample data)
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;

  // Make sure all storage keys are initialized (even if empty)
  const keys = Object.values(KEYS);
  keys.forEach(key => {
    try {
      const data = localStorage.getItem(key);
      if (data === null) {
        if (key === KEYS.SETTINGS) {
          // Initialize default settings
          const defaultSettings = {
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
          };
          localStorage.setItem(key, JSON.stringify(defaultSettings));
        } else if (key === KEYS.ORDERS) {
          // Initialize sample orders for demo user
          const sampleOrders = [
            {
              id: 'ORD-1234567890',
              userId: 'user-1',
              items: [
                {
                  productId: 'product-1',
                  name: 'Sample Product 1',
                  price: 25.500,
                  quantity: 2,
                  total: 51.000
                },
                {
                  productId: 'product-2',
                  name: 'Sample Product 2',
                  price: 15.750,
                  quantity: 1,
                  total: 15.750
                }
              ],
              shipping: {
                fullName: 'Demo User',
                phoneNumber: '+968 1234 5678',
                address: '123 Main St',
                city: 'Muscat',
                region: 'Muscat Governorate',
                postalCode: '123456',
                deliveryNotes: 'Please call before delivery'
              },
              subtotal: 66.750,
              shippingFee: 2.500,
              tax: 6.675,
              total: 75.925,
              paymentMethod: 'Cash on Delivery',
              status: 'Delivered',
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
            },
            {
              id: 'ORD-0987654321',
              userId: 'user-1',
              items: [
                {
                  productId: 'product-3',
                  name: 'Sample Product 3',
                  price: 35.250,
                  quantity: 1,
                  total: 35.250
                }
              ],
              shipping: {
                fullName: 'Demo User',
                phoneNumber: '+968 1234 5678',
                address: '123 Main St',
                city: 'Muscat',
                region: 'Muscat Governorate',
                postalCode: '123456',
                deliveryNotes: ''
              },
              subtotal: 35.250,
              shippingFee: 2.500,
              tax: 3.525,
              total: 41.275,
              paymentMethod: 'Cash on Delivery',
              status: 'Processing',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
            }
          ];
          localStorage.setItem(key, JSON.stringify(sampleOrders));
        } else {
          localStorage.setItem(key, JSON.stringify([]));
        }
      }
    } catch (error) {
      console.error(`Error initializing localStorage for key ${key}:`, error);
    }
  });
};

// Products
export const getProducts = (): Product[] => {
  return getFromStorage<Product>(KEYS.PRODUCTS);
};

export const getProductById = (id: string): Product | null => {
  const products = getProducts();
  return products.find(product => product.id === id) || null;
};

export const addProduct = (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  products.push(newProduct);
  saveToStorage(KEYS.PRODUCTS, products);

  // Create inventory for the new product
  const inventory: Inventory = {
    id: generateId(),
    product_id: newProduct.id,
    quantity: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  addInventory(inventory);

  return newProduct;
};

export const updateProduct = (id: string, product: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);

  if (index === -1) return null;

  const updatedProduct: Product = {
    ...products[index],
    ...product,
    updated_at: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  saveToStorage(KEYS.PRODUCTS, products);

  return updatedProduct;
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);

  if (filteredProducts.length === products.length) return false;

  saveToStorage(KEYS.PRODUCTS, filteredProducts);

  // Delete inventory for this product
  const inventory = getInventory();
  const filteredInventory = inventory.filter(item => item.product_id !== id);
  saveToStorage(KEYS.INVENTORY, filteredInventory);

  return true;
};

// Categories
export const getCategories = (): Category[] => {
  return getFromStorage<Category>(KEYS.CATEGORIES);
};

export const getCategoryById = (id: string): Category | null => {
  const categories = getCategories();
  return categories.find(category => category.id === id) || null;
};

export const addCategory = (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category => {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  categories.push(newCategory);
  saveToStorage(KEYS.CATEGORIES, categories);

  return newCategory;
};

export const updateCategory = (id: string, category: Partial<Category>): Category | null => {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);

  if (index === -1) return null;

  const updatedCategory: Category = {
    ...categories[index],
    ...category,
    updated_at: new Date().toISOString(),
  };

  categories[index] = updatedCategory;
  saveToStorage(KEYS.CATEGORIES, categories);

  return updatedCategory;
};

export const deleteCategory = (id: string): boolean => {
  const categories = getCategories();
  const filteredCategories = categories.filter(category => category.id !== id);

  if (filteredCategories.length === categories.length) return false;

  saveToStorage(KEYS.CATEGORIES, filteredCategories);

  // Delete products in this category
  const products = getProducts();
  const productsToDelete = products.filter(product => product.category_id === id);

  productsToDelete.forEach(product => {
    deleteProduct(product.id);
  });

  return true;
};

// Inventory
export const getInventory = (): Inventory[] => {
  return getFromStorage<Inventory>(KEYS.INVENTORY);
};

export const getInventoryByProductId = (productId: string): Inventory | null => {
  const inventory = getInventory();
  return inventory.find(item => item.product_id === productId) || null;
};

export const getInventoryById = (id: string): Inventory | null => {
  const inventory = getInventory();
  return inventory.find(item => item.id === id) || null;
};

export const addInventory = (inventory: Inventory): Inventory => {
  const inventoryItems = getInventory();
  inventoryItems.push(inventory);
  saveToStorage(KEYS.INVENTORY, inventoryItems);
  return inventory;
};

export const updateInventory = (id: string, data: Partial<Inventory>): Inventory | null => {
  const inventory = getInventory();
  const index = inventory.findIndex(item => item.id === id);

  if (index === -1) return null;

  const updatedInventory: Inventory = {
    ...inventory[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  inventory[index] = updatedInventory;
  saveToStorage(KEYS.INVENTORY, inventory);

  return updatedInventory;
};

// Orders
export const getOrders = (): Order[] => {
  return getFromStorage<Order>(KEYS.ORDERS);
};

export const getOrderById = (id: string): Order | null => {
  const orders = getOrders();
  return orders.find(order => order.id === id) || null;
};

export const addOrder = (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...order,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  orders.push(newOrder);
  saveToStorage(KEYS.ORDERS, orders);

  return newOrder;
};

export const updateOrder = (id: string, order: Partial<Order>): Order | null => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);

  if (index === -1) return null;

  const updatedOrder: Order = {
    ...orders[index],
    ...order,
    updated_at: new Date().toISOString(),
  };

  orders[index] = updatedOrder;
  saveToStorage(KEYS.ORDERS, orders);

  return updatedOrder;
};

// Order Items
export const getOrderItems = (): OrderItem[] => {
  return getFromStorage<OrderItem>(KEYS.ORDER_ITEMS);
};

export const getOrderItemsByOrderId = (orderId: string): OrderItem[] => {
  const orderItems = getOrderItems();
  return orderItems.filter(item => item.order_id === orderId);
};

export const addOrderItem = (orderItem: Omit<OrderItem, 'id' | 'created_at' | 'updated_at'>): OrderItem => {
  const orderItems = getOrderItems();
  const newOrderItem: OrderItem = {
    ...orderItem,
    id: generateId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  orderItems.push(newOrderItem);
  saveToStorage(KEYS.ORDER_ITEMS, orderItems);

  // Update inventory
  const inventory = getInventoryByProductId(orderItem.product_id);
  if (inventory) {
    updateInventory(inventory.id, {
      quantity: Math.max(0, inventory.quantity - orderItem.quantity)
    });
  }

  return newOrderItem;
};

// Settings
export const getSettings = () => {
  if (typeof window === 'undefined') return null;

  try {
    const settings = localStorage.getItem(KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error getting settings from localStorage:', error);
    return null;
  }
};

export const updateSettings = (settings: any) => {
  if (typeof window === 'undefined') return false;

  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings to localStorage:', error);
    return false;
  }
};
