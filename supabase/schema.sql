-- Create categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(255),
  category_id UUID REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carts table
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart_items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id UUID REFERENCES carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
BEFORE UPDATE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at
BEFORE UPDATE ON carts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create function to update inventory when order is placed
CREATE OR REPLACE FUNCTION update_inventory_on_order()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory
  SET quantity = quantity - NEW.quantity
  WHERE product_id = NEW.product_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update inventory when order item is created
CREATE TRIGGER update_inventory_on_order_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_on_order();

-- Create RLS (Row Level Security) policies
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON categories FOR SELECT 
USING (true);

CREATE POLICY "Categories are editable by admins" 
ON categories FOR ALL 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for products
CREATE POLICY "Products are viewable by everyone" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Products are editable by admins" 
ON products FOR ALL 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for inventory
CREATE POLICY "Inventory is viewable by admins" 
ON inventory FOR SELECT 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Inventory is editable by admins" 
ON inventory FOR ALL 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for users
CREATE POLICY "Users can view their own data" 
ON users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" 
ON users FOR SELECT 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Users can update their own data" 
ON users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users" 
ON users FOR ALL 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for orders
CREATE POLICY "Users can view their own orders" 
ON orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" 
ON orders FOR SELECT 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Users can create their own orders" 
ON orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" 
ON orders FOR ALL 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for order_items
CREATE POLICY "Users can view their own order items" 
ON order_items FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM orders WHERE id = order_id));

CREATE POLICY "Admins can view all order items" 
ON order_items FOR SELECT 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

CREATE POLICY "Users can create their own order items" 
ON order_items FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM orders WHERE id = order_id));

CREATE POLICY "Admins can manage all order items" 
ON order_items FOR ALL 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for carts
CREATE POLICY "Users can view their own cart" 
ON carts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own cart" 
ON carts FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all carts" 
ON carts FOR SELECT 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Create policies for cart_items
CREATE POLICY "Users can view their own cart items" 
ON cart_items FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM carts WHERE id = cart_id));

CREATE POLICY "Users can manage their own cart items" 
ON cart_items FOR ALL 
USING (auth.uid() IN (SELECT user_id FROM carts WHERE id = cart_id));

CREATE POLICY "Admins can view all cart items" 
ON cart_items FOR SELECT 
USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
