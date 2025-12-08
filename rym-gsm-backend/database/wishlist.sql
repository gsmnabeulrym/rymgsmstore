-- Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Create index for better performance
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON wishlist(product_id);
CREATE INDEX idx_wishlist_created_at ON wishlist(created_at);

-- Insert some sample wishlist data (optional)
-- You can run this after creating some users and products
/*
INSERT INTO wishlist (user_id, product_id) VALUES
(1, 1),  -- User 1 likes Product 1
(1, 3),  -- User 1 likes Product 3
(2, 2),  -- User 2 likes Product 2
(2, 4);  -- User 2 likes Product 4
*/
