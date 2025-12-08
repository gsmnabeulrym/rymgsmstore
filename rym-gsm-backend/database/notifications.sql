-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('order_update', 'stock_alert', 'price_drop', 'promotion', 'new_product', 'system') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    read_status TINYINT(1) DEFAULT 0,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_read_status (read_status),
    INDEX idx_created_at (created_at),
    INDEX idx_type (type)
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    order_updates TINYINT(1) DEFAULT 1,
    stock_alerts TINYINT(1) DEFAULT 1,
    price_drops TINYINT(1) DEFAULT 1,
    new_products TINYINT(1) DEFAULT 0,
    promotions TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create notification templates table (for admin use)
CREATE TABLE IF NOT EXISTS notification_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('order_update', 'stock_alert', 'price_drop', 'promotion', 'new_product', 'system') NOT NULL,
    title_template VARCHAR(255) NOT NULL,
    message_template TEXT NOT NULL,
    variables JSON,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default notification templates
INSERT INTO notification_templates (name, type, title_template, message_template, variables) VALUES
('Order Confirmed', 'order_update', 'Order Confirmed', 'Your order #{orderId} has been confirmed and is being processed.', '["orderId", "orderTotal"]'),
('Order Shipped', 'order_update', 'Order Shipped', 'Great news! Your order #{orderId} has been shipped and is on its way.', '["orderId", "trackingNumber"]'),
('Order Delivered', 'order_update', 'Order Delivered', 'Your order #{orderId} has been delivered. Thank you for shopping with us!', '["orderId"]'),
('Stock Alert', 'stock_alert', 'Back in Stock', '{productName} is now back in stock! Get it before it runs out again.', '["productName", "productId", "price"]'),
('Price Drop', 'price_drop', 'Price Drop Alert', 'Great news! {productName} price has dropped to {newPrice} Dt (was {oldPrice} Dt).', '["productName", "productId", "newPrice", "oldPrice"]'),
('Welcome', 'system', 'Welcome to RYM GSM!', 'Thank you for joining RYM GSM! Discover the latest smartphones and accessories.', '[]'),
('Promotion', 'promotion', 'Special Offer', 'Don\'t miss out! {promotionTitle} - Save up to {discount}% on selected items.', '["promotionTitle", "discount", "validUntil"]');

-- Sample notifications (optional - for testing)
/*
INSERT INTO notifications (user_id, type, title, message, data) VALUES
(1, 'order_update', 'Order Confirmed', 'Your order #1001 has been confirmed and is being processed.', '{"orderId": 1001, "status": "confirmed", "orderTotal": 1299.00}'),
(1, 'stock_alert', 'Back in Stock', 'iPhone 15 Pro is now back in stock! Get it before it runs out again.', '{"productId": 1, "productName": "iPhone 15 Pro", "price": 2999.00}'),
(1, 'price_drop', 'Price Drop Alert', 'Great news! Samsung Galaxy S24 price has dropped to 2499 Dt (was 2799 Dt).', '{"productId": 2, "productName": "Samsung Galaxy S24", "newPrice": 2499.00, "oldPrice": 2799.00}');
*/
