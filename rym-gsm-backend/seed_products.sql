-- Seed Products Script for Rym GSM Store
-- This script inserts all phones with proper descriptions and image URLs
-- Run this script in your MySQL database to populate the products table

USE rym_gsm;

-- Clear existing products (optional - remove this line if you want to keep existing products)
-- DELETE FROM products WHERE id >= 2;

-- Insert all phones with complete information
INSERT INTO products (id, name, brand, price, stock, category, images, specs, description) VALUES

-- Samsung Galaxy A07 Series
(2, 'Galaxy A07', 'Samsung', 399.00, 25, 'phone', 
 '["https://images.samsung.com/is/image/samsung/p6pim/levant/sm-a047fzkgmea/gallery/levant-galaxy-a04-sm-a047f-sm-a047fzkgmea-534851043", "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a04.jpg"]',
 '{"ram": "4GB", "storage": "128GB", "display": "6.5-inch HD+", "camera": "50MP Main + 2MP Depth", "battery": "5000 mAh", "os": "Android 12", "processor": "Helio P35"}',
 'The Samsung Galaxy A07 offers reliable performance with a 6.5-inch HD+ display and long-lasting 5000mAh battery. Featuring a 50MP main camera and 4GB RAM, this budget-friendly smartphone delivers solid everyday performance for essential tasks and social media.'),

(3, 'Galaxy A07', 'Samsung', 459.00, 20, 'phone', 
 '["https://images.samsung.com/is/image/samsung/p6pim/levant/sm-a047fzkgmea/gallery/levant-galaxy-a04-sm-a047f-sm-a047fzkgmea-534851043", "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-a04.jpg"]',
 '{"ram": "6GB", "storage": "128GB", "display": "6.5-inch HD+", "camera": "50MP Main + 2MP Depth", "battery": "5000 mAh", "os": "Android 12", "processor": "Helio P35"}',
 'The Samsung Galaxy A07 with enhanced 6GB RAM provides smoother multitasking and improved performance for daily use. This variant maintains the same reliable 50MP camera system and 5000mAh battery while offering better memory management for a more responsive user experience.'),

-- Oppo Reno and A Series
(4, 'Reno 14F 5G', 'Oppo', 1999.00, 15, 'phone', 
 '["https://image01.oppo.com/content/dam/oppo/common/mkt/v2-2/reno14f-5g/navigation/Reno14F-5G-Olive-Green-back.png", "https://fdn2.gsmarena.com/vv/bigpic/oppo-reno14f-5g.jpg"]',
 '{"ram": "24GB", "storage": "512GB", "display": "6.67-inch AMOLED 120Hz", "camera": "50MP Triple Camera", "battery": "5000 mAh", "os": "ColorOS 14", "processor": "Snapdragon 685"}',
 'The Oppo Reno 14F 5G is a premium mid-range smartphone featuring a stunning 6.67-inch AMOLED display with 120Hz refresh rate and impressive 24GB RAM for flagship-level performance. With its advanced 50MP triple camera system and sleek design, it delivers exceptional photography and smooth 5G connectivity for power users.'),

(5, 'A5 Pro', 'Oppo', 959.00, 18, 'phone', 
 '["https://image01.oppo.com/content/dam/oppo/common/mkt/v2-2/a5-pro/navigation/A5-Pro-Starry-Purple-back.png", "https://fdn2.gsmarena.com/vv/bigpic/oppo-a5-pro.jpg"]',
 '{"ram": "16GB", "storage": "256GB", "display": "6.7-inch AMOLED", "camera": "108MP Main Camera", "battery": "5000 mAh", "os": "ColorOS 14", "processor": "Snapdragon 695"}',
 'The Oppo A5 Pro combines premium features with excellent value, featuring a large 6.7-inch AMOLED display and powerful 108MP main camera for stunning photography. With 16GB RAM and 256GB storage, this device ensures smooth performance and ample space for all your apps and media.'),

(6, 'A5 5G', 'Oppo', 899.00, 20, 'phone', 
 '["https://image01.oppo.com/content/dam/oppo/common/mkt/v2-2/a5-5g/navigation/A5-5G-Glowing-Blue-back.png", "https://fdn2.gsmarena.com/vv/bigpic/oppo-a5-5g.jpg"]',
 '{"ram": "16GB", "storage": "256GB", "display": "6.67-inch LCD 90Hz", "camera": "50MP Dual Camera", "battery": "5000 mAh", "os": "ColorOS 14", "processor": "Dimensity 6020"}',
 'The Oppo A5 5G delivers fast 5G connectivity with a smooth 90Hz display and generous 16GB RAM for seamless multitasking. Featuring a reliable 50MP camera system and long-lasting 5000mAh battery, its perfect for users seeking 5G performance at an affordable price point.'),

(7, 'A5', 'Oppo', 699.00, 22, 'phone', 
 '["https://image01.oppo.com/content/dam/oppo/common/mkt/v2-2/a5/navigation/A5-Starlight-Black-back.png", "https://fdn2.gsmarena.com/vv/bigpic/oppo-a5.jpg"]',
 '{"ram": "12GB", "storage": "128GB", "display": "6.67-inch LCD", "camera": "50MP Dual Camera", "battery": "5000 mAh", "os": "ColorOS 13", "processor": "Snapdragon 680"}',
 'The Oppo A5 offers excellent value with its large 6.67-inch display and capable 50MP camera system for everyday photography needs. With 12GB RAM and efficient Snapdragon 680 processor, it provides reliable performance for daily tasks and entertainment.'),

(8, 'A3x', 'Oppo', 499.00, 25, 'phone', 
 '["https://image01.oppo.com/content/dam/oppo/common/mkt/v2-2/a3x/navigation/A3x-Starry-Black-back.png", "https://fdn2.gsmarena.com/vv/bigpic/oppo-a3x.jpg"]',
 '{"ram": "4GB", "storage": "64GB", "display": "6.67-inch LCD", "camera": "8MP Main Camera", "battery": "5100 mAh", "os": "ColorOS 14", "processor": "Unisoc Tiger T606"}',
 'The Oppo A3x is an entry-level smartphone that doesnt compromise on essential features, offering a large 6.67-inch display and impressive 5100mAh battery life. Perfect for first-time smartphone users or as a reliable backup device with basic camera and calling capabilities.'),

(9, 'A5x', 'Oppo', 599.00, 20, 'phone', 
 '["https://image01.oppo.com/content/dam/oppo/common/mkt/v2-2/a5x/navigation/A5x-Starlight-Purple-back.png", "https://fdn2.gsmarena.com/vv/bigpic/oppo-a5x.jpg"]',
 '{"ram": "8GB", "storage": "128GB", "display": "6.67-inch LCD", "camera": "50MP Main Camera", "battery": "5100 mAh", "os": "ColorOS 14", "processor": "Snapdragon 680"}',
 'The Oppo A5x strikes a perfect balance between performance and affordability with its 8GB RAM and 50MP main camera for quality photos. The large 6.67-inch display and robust 5100mAh battery make it ideal for media consumption and all-day usage.'),

-- Honor X6c Series
(10, 'X6c', 'Honor', 419.00, 18, 'phone', 
 '["https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/honor-x6c/honor-x6c-black-front.png", "https://fdn2.gsmarena.com/vv/bigpic/honor-x6c.jpg"]',
 '{"ram": "6GB", "storage": "128GB", "display": "6.56-inch LCD", "camera": "50MP Triple Camera", "battery": "5200 mAh", "os": "Magic UI 8.0", "processor": "Helio G36"}',
 'The Honor X6c combines reliable performance with exceptional battery life, featuring a 6.56-inch display and powerful 5200mAh battery for extended usage. With its 50MP triple camera system and 6GB RAM, it offers great value for photography enthusiasts and everyday users alike.'),

(11, 'X6c', 'Honor', 479.00, 15, 'phone', 
 '["https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/phones/honor-x6c/honor-x6c-black-front.png", "https://fdn2.gsmarena.com/vv/bigpic/honor-x6c.jpg"]',
 '{"ram": "6GB", "storage": "256GB", "display": "6.56-inch LCD", "camera": "50MP Triple Camera", "battery": "5200 mAh", "os": "Magic UI 8.0", "processor": "Helio G36"}',
 'The Honor X6c with expanded 256GB storage provides ample space for apps, photos, and videos while maintaining the same reliable performance. This variant offers enhanced storage capacity for users who need extra space without compromising on the excellent camera quality and long battery life.'),

-- Itel Series
(12, 'A90', 'Itel', 299.00, 30, 'phone', 
 '["https://www.itel.com/uploads/product/A90-Blue-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/itel-a90.jpg"]',
 '{"ram": "3GB", "storage": "64GB", "display": "6.6-inch LCD", "camera": "48MP Dual Camera", "battery": "4000 mAh", "os": "Android 14 Go", "processor": "Unisoc Tiger T606"}',
 'The Itel A90 is an ultra-affordable smartphone that delivers surprising value with its 48MP dual camera system and large 6.6-inch display. Running Android 14 Go edition for optimized performance, its perfect for budget-conscious users who want modern smartphone features without breaking the bank.'),

(13, 'A50c', 'Itel', 279.00, 35, 'phone', 
 '["https://www.itel.com/uploads/product/A50c-Black-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/itel-a50c.jpg"]',
 '{"ram": "2GB", "storage": "64GB", "display": "6.1-inch LCD", "camera": "5MP Main Camera", "battery": "3000 mAh", "os": "Android 13 Go", "processor": "Unisoc SC9863A"}',
 'The Itel A50c is designed for essential smartphone needs at an incredibly affordable price point, featuring a compact 6.1-inch display and basic camera functionality. Ideal as a first smartphone or backup device, it provides reliable calling, messaging, and basic app functionality with Android Go optimization.'),

-- Infinix Series
(14, 'Smart 10', 'Infinix', 279.00, 25, 'phone', 
 '["https://www.infinixmobility.com/uploads/product/Smart-10-Blue-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/infinix-smart-10.jpg"]',
 '{"ram": "3GB", "storage": "64GB", "display": "6.6-inch LCD", "camera": "48MP Dual Camera", "battery": "5000 mAh", "os": "Android 14", "processor": "Helio G36"}',
 'The Infinix Smart 10 offers impressive value with its large 6.6-inch display and capable 48MP camera system for capturing lifes moments. With a robust 5000mAh battery and Android 14, it provides reliable all-day performance for essential smartphone tasks and entertainment.'),

(15, 'Smart 10', 'Infinix', 319.00, 22, 'phone', 
 '["https://www.infinixmobility.com/uploads/product/Smart-10-Blue-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/infinix-smart-10.jpg"]',
 '{"ram": "4GB", "storage": "128GB", "display": "6.6-inch LCD", "camera": "48MP Dual Camera", "battery": "5000 mAh", "os": "Android 14", "processor": "Helio G36"}',
 'The Infinix Smart 10 with enhanced 4GB RAM and 128GB storage delivers improved multitasking capabilities and ample space for apps and media. This variant maintains the excellent 48MP camera performance while offering smoother operation for users who need extra memory and storage.'),

(16, 'Smart 10', 'Infinix', 359.00, 20, 'phone', 
 '["https://www.infinixmobility.com/uploads/product/Smart-10-Blue-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/infinix-smart-10.jpg"]',
 '{"ram": "4GB", "storage": "256GB", "display": "6.6-inch LCD", "camera": "48MP Dual Camera", "battery": "5000 mAh", "os": "Android 14", "processor": "Helio G36"}',
 'The top-tier Infinix Smart 10 variant offers generous 256GB storage for users who need maximum space for photos, videos, and applications. With the same reliable 48MP camera and 5000mAh battery, this model is perfect for heavy users who demand both performance and storage capacity.'),

(17, 'Hot 50I', 'Infinix', 409.00, 18, 'phone', 
 '["https://www.infinixmobility.com/uploads/product/Hot-50I-Black-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/infinix-hot-50i.jpg"]',
 '{"ram": "6GB", "storage": "128GB", "display": "6.7-inch LCD 90Hz", "camera": "48MP Triple Camera", "battery": "5000 mAh", "os": "Android 14", "processor": "Helio G36"}',
 'The Infinix Hot 50I features a smooth 90Hz display and enhanced 6GB RAM for improved gaming and multitasking performance. With its 48MP triple camera system and large 6.7-inch screen, it delivers an engaging multimedia experience at an attractive price point.'),

(18, 'Hot 60 5G', 'Infinix', 329.00, 20, 'phone', 
 '["https://www.infinixmobility.com/uploads/product/Hot-60-5G-Green-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/infinix-hot-60-5g.jpg"]',
 '{"ram": "6GB", "storage": "128GB", "display": "6.78-inch LCD 120Hz", "camera": "108MP Triple Camera", "battery": "5000 mAh", "os": "Android 14", "processor": "Dimensity 6020"}',
 'The Infinix Hot 60 5G brings flagship-level features to the mid-range segment with its impressive 108MP camera and smooth 120Hz display. Powered by 5G connectivity and 6GB RAM, it offers excellent performance for gaming, photography, and streaming at an affordable price.'),

(19, 'Hot 60 5G', 'Infinix', 599.00, 15, 'phone', 
 '["https://www.infinixmobility.com/uploads/product/Hot-60-5G-Green-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/infinix-hot-60-5g.jpg"]',
 '{"ram": "8GB", "storage": "256GB", "display": "6.78-inch LCD 120Hz", "camera": "108MP Triple Camera", "battery": "5000 mAh", "os": "Android 14", "processor": "Dimensity 6020"}',
 'The premium Infinix Hot 60 5G variant with 8GB RAM and 256GB storage delivers flagship-level performance for demanding users. The combination of 108MP camera, 120Hz display, and enhanced memory makes it perfect for mobile photography enthusiasts and power users who need extra storage.'),

(20, 'Hot 60 Pro+', 'Infinix', 799.00, 12, 'phone', 
 '["https://www.infinixmobility.com/uploads/product/Hot-60-Pro-Plus-Gold-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/infinix-hot-60-pro-plus.jpg"]',
 '{"ram": "16GB", "storage": "256GB", "display": "6.78-inch AMOLED 120Hz", "camera": "108MP Triple Camera", "battery": "5000 mAh", "os": "Android 14", "processor": "Dimensity 7020"}',
 'The Infinix Hot 60 Pro+ represents the pinnacle of the series with its stunning AMOLED display, massive 16GB RAM, and premium build quality. Featuring an advanced 108MP camera system and powerful Dimensity processor, it delivers flagship performance and photography capabilities at a competitive price.'),

(21, 'Hot 50s', 'Infinix', 899.00, 15, 'phone', 
 '["https://www.infinixmobility.com/uploads/product/Hot-50s-Purple-Front.png", "https://fdn2.gsmarena.com/vv/bigpic/infinix-hot-50s.jpg"]',
 '{"ram": "8GB", "storage": "256GB", "display": "6.78-inch AMOLED 120Hz", "camera": "108MP Triple Camera", "battery": "5000 mAh", "os": "Android 14", "processor": "Helio G88"}',
 'The Infinix Hot 50s combines premium AMOLED display technology with powerful performance, featuring a vibrant 120Hz screen and impressive 108MP camera system. With 8GB RAM and 256GB storage, it offers excellent value for users seeking flagship features without the premium price tag.'),

-- Redmi Series
(22, 'A5', 'Redmi', 289.00, 28, 'phone', 
 '["https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-a5/redmi-a5-black-front.png", "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-a5.jpg"]',
 '{"ram": "3GB", "storage": "64GB", "display": "6.52-inch LCD", "camera": "8MP Main Camera", "battery": "5000 mAh", "os": "Android 14 Go", "processor": "Helio G36"}',
 'The Redmi A5 delivers reliable Xiaomi quality at an entry-level price point, featuring a large 6.52-inch display and long-lasting 5000mAh battery. Running Android 14 Go for optimized performance, its perfect for users seeking a dependable smartphone for basic daily tasks and communication.'),

(23, 'A5', 'Redmi', 349.00, 25, 'phone', 
 '["https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-a5/redmi-a5-black-front.png", "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-a5.jpg"]',
 '{"ram": "4GB", "storage": "128GB", "display": "6.52-inch LCD", "camera": "8MP Main Camera", "battery": "5000 mAh", "os": "Android 14 Go", "processor": "Helio G36"}',
 'The enhanced Redmi A5 with 4GB RAM and 128GB storage provides improved multitasking capabilities and ample space for apps and media. This variant offers better performance for users who need extra memory while maintaining the same reliable battery life and build quality.'),

(24, 'Note 14', 'Redmi', 699.00, 20, 'phone', 
 '["https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-note-14/redmi-note-14-blue-front.png", "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14.jpg"]',
 '{"ram": "6GB", "storage": "128GB", "display": "6.67-inch AMOLED 120Hz", "camera": "108MP Triple Camera", "battery": "5110 mAh", "os": "MIUI 15", "processor": "Snapdragon 685"}',
 'The Redmi Note 14 continues Xiaomis tradition of exceptional value with its stunning AMOLED display, powerful 108MP camera system, and smooth 120Hz refresh rate. Featuring 6GB RAM and reliable Snapdragon performance, it delivers flagship-level features at a mid-range price point.'),

(25, 'Note 14', 'Redmi', 789.00, 18, 'phone', 
 '["https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-note-14/redmi-note-14-blue-front.png", "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14.jpg"]',
 '{"ram": "8GB", "storage": "128GB", "display": "6.67-inch AMOLED 120Hz", "camera": "108MP Triple Camera", "battery": "5110 mAh", "os": "MIUI 15", "processor": "Snapdragon 685"}',
 'The Redmi Note 14 with enhanced 8GB RAM offers superior multitasking performance for power users who demand smooth operation across multiple apps. Maintaining the excellent 108MP camera and AMOLED display, this variant provides enhanced performance for gaming and productivity tasks.'),

(26, 'Note 14', 'Redmi', 839.00, 15, 'phone', 
 '["https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-note-14/redmi-note-14-blue-front.png", "https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14.jpg"]',
 '{"ram": "8GB", "storage": "256GB", "display": "6.67-inch AMOLED 120Hz", "camera": "108MP Triple Camera", "battery": "5110 mAh", "os": "MIUI 15", "processor": "Snapdragon 685"}',
 'The top-tier Redmi Note 14 combines 8GB RAM with generous 256GB storage for users who need maximum performance and space. Perfect for content creators and heavy users, it offers flagship-level photography capabilities, smooth AMOLED display, and ample storage for all your apps and media.');

-- Reset AUTO_INCREMENT if needed
-- ALTER TABLE products AUTO_INCREMENT = 27;

-- Verify the insertion
SELECT COUNT(*) as 'Total Products Inserted' FROM products WHERE id BETWEEN 2 AND 26;
