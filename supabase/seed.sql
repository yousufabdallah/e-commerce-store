-- Insert categories
INSERT INTO categories (id, name, description) VALUES
('11111111-1111-1111-1111-111111111111', 'Electronics', 'Electronic devices and gadgets'),
('22222222-2222-2222-2222-222222222222', 'Clothing', 'Fashion items and apparel'),
('33333333-3333-3333-3333-333333333333', 'Home & Kitchen', 'Items for your home');

-- Insert products
INSERT INTO products (id, name, description, price, image_url, category_id) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Smartphone X', 'The latest smartphone with advanced features and high-performance capabilities.', 799.99, '/images/smartphone.jpg', '11111111-1111-1111-1111-111111111111'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Laptop Pro', 'Powerful laptop for professionals with high-speed processing and excellent graphics.', 1299.99, '/images/laptop.jpg', '11111111-1111-1111-1111-111111111111'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Wireless Headphones', 'Premium wireless headphones with noise cancellation and long battery life.', 199.99, '/images/headphones.jpg', '11111111-1111-1111-1111-111111111111'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Smart Watch', 'Track your fitness and stay connected with this advanced smart watch.', 249.99, '/images/smartwatch.jpg', '11111111-1111-1111-1111-111111111111'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Men\'s T-Shirt', 'Comfortable cotton t-shirt for everyday wear.', 29.99, '/images/tshirt.jpg', '22222222-2222-2222-2222-222222222222'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Women\'s Jeans', 'Stylish and durable jeans for women.', 59.99, '/images/jeans.jpg', '22222222-2222-2222-2222-222222222222'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'Coffee Maker', 'Automatic coffee maker for brewing delicious coffee at home.', 89.99, '/images/coffeemaker.jpg', '33333333-3333-3333-3333-333333333333'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'Blender', 'Powerful blender for smoothies and food preparation.', 69.99, '/images/blender.jpg', '33333333-3333-3333-3333-333333333333');

-- Insert inventory
INSERT INTO inventory (product_id, quantity) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 20),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 15),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 30),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 25),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 50),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 40),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 10),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 5);

-- Insert admin user (Note: In a real application, you would create this user through Supabase Auth UI)
-- This is just for demonstration purposes
INSERT INTO users (id, name, role) VALUES
('00000000-0000-0000-0000-000000000000', 'Admin User', 'admin');

-- Insert sample orders
INSERT INTO orders (id, user_id, status, total) VALUES
('11111111-aaaa-bbbb-cccc-dddddddddddd', '00000000-0000-0000-0000-000000000000', 'delivered', 1099.98);

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
('11111111-aaaa-bbbb-cccc-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 1, 799.99),
('11111111-aaaa-bbbb-cccc-dddddddddddd', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 1, 199.99);
