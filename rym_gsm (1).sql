-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 10 déc. 2025 à 17:30
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `rym_gsm`
--

-- --------------------------------------------------------

--
-- Structure de la table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`products`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `chatbot_conversations`
--

CREATE TABLE `chatbot_conversations` (
  `id` int(11) NOT NULL,
  `session_id` varchar(100) NOT NULL,
  `user_message` text NOT NULL,
  `bot_response` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `chatbot_conversations`
--

INSERT INTO `chatbot_conversations` (`id`, `session_id`, `user_message`, `bot_response`, `created_at`) VALUES
(1, 'session_z1oshygbh_1759334153370', 'What are your shipping options?', '🚚 **Shipping Information:**\n• Standard delivery: 2-3 business days\n• Express delivery: Next business day\n• Free shipping on orders over 100 DT\n• We deliver nationwide across Tunisia', '2025-10-01 15:57:19'),
(2, 'session_z1oshygbh_1759334153370', 'hey', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:14:14'),
(3, 'session_z1oshygbh_1759334153370', 'i want to ask about payments', '💳 **Payment Methods:**\n• Credit/Debit Cards (Visa, Mastercard)\n• Cash on Delivery\n• Bank Transfer\n• Mobile Payment (D17, Flouci)\n• All payments are secure and encrypted', '2025-10-01 16:14:26'),
(4, 'session_z1oshygbh_1759334153370', 'i want to ask', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:14:57'),
(5, 'session_z1oshygbh_1759334153370', 'other thing', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:15:08'),
(6, 'session_z1oshygbh_1759334153370', 'technical support', '🔧 **Technical Support:**\n• Free technical support for all customers\n• Setup assistance for new phones\n• Troubleshooting guides available\n• Contact our experts for complex issues', '2025-10-01 16:15:26'),
(7, 'session_rckqzywsy_1759335544661', 'Do you have iPhone 15 in stock?', '📱 **Our Products:**\n• Latest smartphones from top brands\n• iPhone, Samsung, Oppo, Xiaomi, Huawei\n• All phones are original and unlocked\n• Competitive prices with regular promotions', '2025-10-01 16:19:37'),
(8, 'session_rckqzywsy_1759335544661', 'What\'s your return policy?', '🛡️ **Warranty & Returns:**\n• 2-year manufacturer warranty on all phones\n• 14-day return policy\n• Free exchanges for defective items\n• Original packaging required for returns', '2025-10-01 16:20:53'),
(9, 'session_rckqzywsy_1759335544661', 'Do you have any promotions?', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:20:59'),
(10, 'session_rckqzywsy_1759335544661', 'Do you have any promotions?', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:21:05'),
(11, 'session_rckqzywsy_1759335544661', 'hey', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:21:22'),
(12, 'session_rckqzywsy_1759335544661', 'promotion', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:21:38'),
(13, 'session_rckqzywsy_1759335544661', 'Do you have any promotions?', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:21:45'),
(14, 'session_rckqzywsy_1759335544661', 'What\'s your return policy?', '🛡️ **Warranty & Returns:**\n• 2-year manufacturer warranty on all phones\n• 14-day return policy\n• Free exchanges for defective items\n• Original packaging required for returns', '2025-10-01 16:22:35'),
(15, 'session_rckqzywsy_1759335544661', 'Do you have any promotions?', '🤖 **I\'m here to help!**\n\nI can assist you with:\n• Shipping & Delivery info\n• Payment methods\n• Warranty & Returns\n• Product information\n• Store details\n• Technical support\n\nWhat would you like to know?', '2025-10-01 16:22:40'),
(16, 'session_xn64nc9wk_1759335872322', 'How can I contact customer support?', '🏪 **Store Information:**\n• Online store with nationwide delivery\n• Customer service: Available 9AM-8PM\n• Email: support@rym-gsm.com\n• Phone: +216 XX XXX XXX\n• Fast and reliable service', '2025-10-01 16:24:39'),
(17, 'session_xn64nc9wk_1759335872322', 'Do you have any promotions?', '🎉 **Current Promotions & Offers:**\n• Check our latest deals on featured products\n• Seasonal discounts up to 30% off\n• Bundle offers on phones + accessories\n• Student discounts available\n• Free shipping on orders over 100 DT\n• Follow us for flash sales and exclusive offers!', '2025-10-01 16:24:52'),
(18, 'session_xn64nc9wk_1759335872322', 'What payment methods do you accept?', '💳 **Payment Methods:**\n• Credit/Debit Cards (Visa, Mastercard)\n• Cash on Delivery\n• Bank Transfer\n• Mobile Payment (D17, Flouci)\n• All payments are secure and encrypted', '2025-10-01 16:24:59'),
(19, 'session_xn64nc9wk_1759335872322', 'Do you have any promotions?', '🤖 Based on our conversation, 🎉 **current promotions & offers:**\n• check our latest deals on featured products\n• seasonal discounts up to 30% off\n• bundle offers on phones + accessories\n• student discounts available\n• free shipping on orders over 100 dt\n• follow us for flash sales and exclusive offers!', '2025-10-01 16:25:03'),
(20, 'session_xn64nc9wk_1759335872322', 'Do you offer installment plans?', '🤖 Based on our conversation, 🎉 **current promotions & offers:**\n• check our latest deals on featured products\n• seasonal discounts up to 30% off\n• bundle offers on phones + accessories\n• student discounts available\n• free shipping on orders over 100 dt\n• follow us for flash sales and exclusive offers!', '2025-10-01 16:25:06'),
(21, 'session_xn64nc9wk_1759335872322', 'hey', '🤖 **I understand you\'re asking about something specific.**\n\nBased on our conversation, I can help you with:\n• General phone store questions\n\nWhat would you like to know more about?', '2025-10-01 16:32:04'),
(22, 'session_ep38y3cev_1759337061248', 'Do you have iPhone 15 in stock?', '📱 **Our Products:**\n• Latest smartphones from top brands\n• iPhone, Samsung, Oppo, Xiaomi, Huawei\n• All phones are original and unlocked\n• Competitive prices with regular promotions', '2025-10-01 16:44:44'),
(23, 'session_qrwe891e2_1759337246663', 'What\'s your return policy?', '🛡️ **Warranty & Returns:**\n• 2-year manufacturer warranty on all phones\n• 14-day return policy\n• Free exchanges for defective items\n• Original packaging required for returns', '2025-10-01 16:47:36'),
(24, 'session_009', 'iPhone 15 Pro Max price?', 'iPhone 15 Pro Max starts at 3200 DT. It has the best camera and performance!', '2025-10-02 09:46:10'),
(25, 'session_010', 'Samsung Galaxy S24 features', 'Galaxy S24 has amazing AI features, 200MP camera, and great battery life.', '2025-10-02 09:46:10'),
(26, 'session_011', 'I need a phone under 1000 DT', 'Great! I can recommend several excellent phones under 1000 DT. What features matter most?', '2025-10-02 09:46:10'),
(27, 'session_012', 'Gaming phone recommendations', 'For gaming, I recommend phones with high refresh rates and powerful processors.', '2025-10-02 09:46:10'),
(28, 'session_013', 'Terrible customer service', 'I apologize for your bad experience. Let me help make this right for you.', '2025-10-02 09:46:10'),
(29, 'session_014', 'Best camera phone 2024', 'The iPhone 15 Pro and Galaxy S24 Ultra have the best cameras this year!', '2025-10-02 09:46:10'),
(30, 'session_015', 'Warranty information', 'All phones come with 2-year manufacturer warranty and 14-day return policy.', '2025-10-02 09:46:10'),
(31, 'session_016', 'Payment methods available', 'We accept credit cards, bank transfers, and cash on delivery.', '2025-10-02 09:46:10'),
(32, 'session_017', 'Excellent service thank you', 'You are very welcome! I am so happy I could help you today.', '2025-10-02 09:46:10'),
(33, 'session_018', 'Phone battery replacement', 'We offer battery replacement services for most phone models.', '2025-10-02 09:46:10'),
(34, 'session_81swdtvjd_1759404511485', 'What payment methods do you accept?', '💳 **Payment Methods:**\n• Credit/Debit Cards (Visa, Mastercard)\n• Cash on Delivery\n• Bank Transfer\n• Mobile Payment (D17, Flouci)\n• All payments are secure and encrypted', '2025-10-02 11:28:58'),
(35, 'session_81swdtvjd_1759404511485', 'What\'s your return policy?', '🛡️ **Warranty & Returns:**\n• 2-year manufacturer warranty on all phones\n• 14-day return policy\n• Free exchanges for defective items\n• Original packaging required for returns', '2025-10-02 11:29:03'),
(36, 'session_81swdtvjd_1759404511485', 'Do you have any promotions?', '🎉 **Current Promotions & Offers:**\n• Check our latest deals on featured products\n• Seasonal discounts up to 30% off\n• Bundle offers on phones + accessories\n• Student discounts available\n• Free shipping on orders over 100 DT\n• Follow us for flash sales and exclusive offers!', '2025-10-02 11:29:05'),
(37, 'session_rus9jk20j_1759411204538', 'Do you have iPhone 15 in stock?', '📱 **Our Products:**\n• Latest smartphones from top brands\n• iPhone, Samsung, Oppo, Xiaomi, Huawei\n• All phones are original and unlocked\n• Competitive prices with regular promotions', '2025-10-02 13:20:24'),
(38, 'session_rus9jk20j_1759411204538', 'What\'s your return policy?', '🛡️ **Warranty & Returns:**\n• 2-year manufacturer warranty on all phones\n• 14-day return policy\n• Free exchanges for defective items\n• Original packaging required for returns', '2025-10-02 13:20:27'),
(39, 'session_l2qdfldgf_1761568998163', 'Do you have iPhone 15 in stock?', '📱 **Our Products:**\n• Latest smartphones from top brands\n• iPhone, Samsung, Oppo, Xiaomi, Huawei\n• All phones are original and unlocked\n• Competitive prices with regular promotions', '2025-10-27 12:44:22');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('order_update','stock_alert','price_drop','promotion','new_product','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `read_status` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `read_status`, `read_at`, `created_at`) VALUES
(12, 11, 'new_product', '🆕 New Product Available!', 'Check out the new iPhone 15 Pro Max by Apple! Now available in our store starting at 1299 DT.', '{\"productId\":1,\"productName\":\"iPhone 15 Pro Max\",\"brand\":\"Apple\",\"price\":1299,\"category\":\"phone\"}', 1, '2025-09-25 15:53:04', '2025-09-25 14:40:30'),
(14, 11, 'promotion', '🎉 Black Friday Sale', 'Huge discounts on all smartphones! Save up to 40% on selected items.', '{\"discount\":40,\"validUntil\":\"2024-11-30\",\"productIds\":[1,2,3],\"isPromotion\":true}', 1, '2025-09-25 15:53:04', '2025-09-25 14:40:30'),
(17, 11, 'system', '📢 Website Maintenance', 'Our website will undergo scheduled maintenance on Sunday from 2 AM to 4 AM. Thank you for your patience.', '{\"isSystemUpdate\":true,\"isUrgent\":false}', 1, '2025-09-25 15:53:04', '2025-09-25 14:40:30'),
(19, 11, 'system', '🚨 URGENT: Security Update', 'We have implemented important security updates. Please log out and log back in for the changes to take effect.', '{\"isSystemUpdate\":true,\"isUrgent\":true}', 1, '2025-09-25 15:53:04', '2025-09-25 14:40:30'),
(25, 11, 'system', '🎉 Welcome to RYM GSM!', 'Your notification system is now active. You\'ll receive updates about orders, new products, and special offers.', '{\"welcome\":true}', 1, '2025-09-25 15:53:04', '2025-09-25 14:42:22'),
(27, 11, 'promotion', '🎯 Black Friday Sale - 40% Off!', 'Don\'t miss our biggest sale of the year! Get up to 40% off on all smartphones and accessories. Limited time offer!', '{\"discount\":40,\"validUntil\":\"2024-12-31\",\"isPromotion\":true}', 1, '2025-09-25 15:53:04', '2025-09-25 14:42:22'),
(28, 11, 'price_drop', '💰 Price Drop Alert!', 'Great news! Samsung Galaxy S24 Ultra price has dropped from 1199 DT to 999 DT. Save 200 DT now!', '{\"productId\":2,\"productName\":\"Samsung Galaxy S24 Ultra\",\"oldPrice\":1199,\"newPrice\":999}', 1, '2025-09-25 15:53:04', '2025-09-25 14:42:22'),
(29, 11, 'stock_alert', '📦 Back in Stock!', 'Good news! Google Pixel 8 Pro is now back in stock. Get it before it runs out again!', '{\"productId\":3,\"productName\":\"Google Pixel 8 Pro\"}', 1, '2025-09-25 15:53:04', '2025-09-25 14:42:22'),
(35, 11, 'system', '🎉 Welcome to RYM GSM!', 'Your notification system is now active. You\'ll receive updates about orders, new products, and special offers.', '{\"welcome\":true}', 1, '2025-09-25 15:53:04', '2025-09-25 15:36:31'),
(37, 11, 'promotion', '🎯 Black Friday Sale - 40% Off!', 'Don\'t miss our biggest sale of the year! Get up to 40% off on all smartphones and accessories. Limited time offer!', '{\"discount\":40,\"validUntil\":\"2024-12-31\",\"isPromotion\":true}', 1, '2025-09-25 15:53:04', '2025-09-25 15:36:31'),
(38, 11, 'price_drop', '💰 Price Drop Alert!', 'Great news! Samsung Galaxy S24 Ultra price has dropped from 1199 DT to 999 DT. Save 200 DT now!', '{\"productId\":2,\"productName\":\"Samsung Galaxy S24 Ultra\",\"oldPrice\":1199,\"newPrice\":999}', 1, '2025-09-25 15:53:04', '2025-09-25 15:36:31'),
(39, 11, 'stock_alert', '📦 Back in Stock!', 'Good news! Google Pixel 8 Pro is now back in stock. Get it before it runs out again!', '{\"productId\":3,\"productName\":\"Google Pixel 8 Pro\"}', 1, '2025-09-25 15:53:04', '2025-09-25 15:36:31'),
(77, 11, 'promotion', '🎉 iphone 15 promotion', 'hurry up now ', '{\"discount\":30,\"validUntil\":\"2025-10-05\",\"productIds\":[32],\"isPromotion\":true}', 1, NULL, '2025-09-30 10:04:47'),
(79, 11, 'new_product', '🆕 New Product Available!', 'Check out the new A5 Pro by Oppo! Now available in our store starting at 12 DT.', '{\"productId\":52,\"productName\":\"A5 Pro\",\"brand\":\"Oppo\",\"price\":12,\"category\":\"phone\"}', 1, NULL, '2025-09-30 10:26:43'),
(99, 11, 'promotion', '🎉 aaaaa', 'aaaaaaaaaaaaaaa\n\n🏷️ Oppo A5 Pro\n💰 8.99 Dt → 5 Dt\n💸 Save 3.99 Dt (44% off!)', '{\"discount\":44,\"validUntil\":\"2025-10-02\",\"productIds\":[52],\"isPromotion\":true}', 0, NULL, '2025-09-30 14:12:00'),
(101, 11, 'promotion', '🎉 aaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaaaaaa\n\n🏷️ Oppo A5 Pro\n💰 8.99 Dt → 4 Dt\n💸 Save 4.99 Dt (56% off!)', '{\"discount\":56,\"validUntil\":\"2025-10-12\",\"productIds\":[52],\"isPromotion\":true}', 0, NULL, '2025-09-30 14:17:44'),
(103, 11, 'promotion', '🎉 nnnnnnnnnnnnn', 'nnnnnnnnnnnnnnnnnnnn\n\n🏷️ Apple AirPods Pro (2nd Gen)\n💰 249.99 Dt → 230 Dt\n💸 Save 19.99 Dt (8% off!)', '{\"discount\":8,\"validUntil\":\"2025-10-01\",\"productIds\":[35],\"isPromotion\":true}', 0, NULL, '2025-09-30 14:18:23'),
(105, 11, 'promotion', '🎉 apple', 'apple\n\n🏷️ Apple iPhone 15 Pro\n💰 999.99 Dt → 650 Dt\n💸 Save 349.99 Dt (35% off!)', '{\"discount\":35,\"validUntil\":\"2025-10-08\",\"productIds\":[32],\"isPromotion\":true}', 0, NULL, '2025-09-30 14:21:01'),
(107, 11, 'promotion', '🎉 sam', 'sam\n\n🏷️ Samsung Samsung Galaxy S24 Ultra\n💰 1199.99 Dt → 1000 Dt\n💸 Save 199.99 Dt (17% off!)', '{\"discount\":17,\"validUntil\":\"2025-10-01\",\"productIds\":[33],\"isPromotion\":true}', 0, NULL, '2025-09-30 14:22:57'),
(109, 11, 'promotion', '🎉 samsung', 'samsung\n\n🏷️ Apple AirPods Pro (2nd Gen)\n💰 249.99 Dt → 219.97 Dt\n💸 Save 30.02 Dt (12% off!)', '{\"discount\":12,\"validUntil\":\"2025-10-03\",\"productIds\":[35],\"isPromotion\":true}', 0, NULL, '2025-09-30 14:27:26');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `read_status`, `read_at`, `created_at`) VALUES
(111, 11, 'promotion', '🎉 test', 'test\n\n🏷️ Oppo A5 Pro\n💰 8.99 Dt → 3 Dt\n💸 Save 5.99 Dt (67% off!)', '{\"validUntil\":\"2025-10-04\",\"isPromotion\":true,\"productId\":52,\"salePrice\":3,\"productName\":\"A5 Pro\",\"productBrand\":\"Oppo\",\"productImage\":\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsLCwsMCwwODgwREhASERkXFRUXGSYbHRsdGyY6JCokJCokOjM+Mi8yPjNcSEBASFxqWVRZaoFzc4GimqLT0///2wBDAQsLCwsMCwwODgwREhASERkXFRUXGSYbHRsdGyY6JCokJCokOjM+Mi8yPjNcSEBASFxqWVRZaoFzc4GimqLT0///wAARCAM8AzwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1yiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoqlNqdhBnfdR5H8IO4/kKy38S2iH91BLL9cIKdmbwwuIqfDSl+SOhorjn8TXpyIoYUB9cuaovreqv/AMvRT2QAUWZ1xyvEvdwj6s7+ivM2u7t87rqY/wDAzUB+Y5JJ+pzT5TZZQ+tdfKJ6gZol6yIPqwFN+1Wv/PxF/wB9rXl+1f7opdo9BRylrKIdaz/8BPUBc2x6XEX/AH2KesiN0dT9DXle1fQUbV/uijlB5RHpXf8A4Ceq1DdXUNrC8srYRfzJrzNWZPuOy/7rEfyp7zTyALJNI4ByAzE0collNpK9a8euljZufEF7Kx8jEKfQM1RRa9qkbAtOJR6OorHop2R6KwuGUeX2MLeh6RpWq217E2AUlTlkJq3Xm+n3D217byqcfOFb3VjgivSKlo8LHYaOHqrl+CSugooopHCFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRSSSRxKXd1VR1JOBWBceJIIsi1jMrdmb5UFBtSw9as7U4N+fQ6Csy61nT7YYM29/wC7H81cbdale3fEs52f3F+VaoVVj1aOVLerO/lE6OfxJdNkQQpGPVvnasWe7u7kkz3Ej+xPH5Cq2QKs29pdXRxBbySe4HH5mmehChh6CvGEY2+0/wDNlYAClroIfDl4x/fSxxew+c1rJ4bsY/8AWSTSH6hf5UXRlPMMLD/l5zP+6rnE8ClRWf7is3+6Ca9Fi0zTYR8lnHu/vEZP61dVVXoAKXMcs82h9ii36ux5vHYX8n3LOc/8ANWl0PVSM/ZCP95lFd9RSuYPNq3SlBfezhl8PaoescQ+slO/4R3UfWD/AL7P+FdvRRdkPNMT2h9xxLeG9TT/AJ4f991CdB1Qf8sUP0kFd5RRdgs0xPaD+R582j6ov/Lm5/3SGqnNb3FuQJoJIyem9cZr02oL2xgu4GhmyCeVYdUNO5tSzWfNFVKceXq0eZ0VqXWi6jbMcwNInZ4xmoYdM1GdgI7SX6sNo/M0z1lWouPMqsOXvcisYHuLy2iQZLSKfwU5NelVk6VpSWKl3IeZhgt2A9BWtUtngY/Exr1UofDBWT7hRRRSOAKKR3VEZnYKqjJJ6AVjf8JDpu/GZcf39ny0GtOjVq35KcpW3sjaoptvc288fmRSq49VNOoM2mm0000FFFFAgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACioZby0gOJbiJP95gKg/tTTP+f+3/AO+6DRUqsldU5NeSLtFUv7U0z/n/ALf/AL7FA1XTP+f+3/77oH7Ct/z6n/4Cy7RVMarpYBJvYCf98Uo1bTB/y/wf99igPY1v+fU//AWW6Kpf2rpv/P8A2/8A33R/ammf8/8Ab/8AfYoD2Nb/AJ9T/wDAWXaKrxahp7nCXcLt2UOKsUESjKPxRa9UcZ4lWf8AtBTISYyg8v0BHWufr0+7sIdQgMLjC9VYdQfWsKDwzBE2bicy+iqNgqkz2sLmFCGHjGekoK1ktzkIopZ32QxvI/ooya37Xw7cSc3Eqwj0X52rrooYoUCRRqijsoxT6LmFbNKstKUVBd3qzNttHsLbBWEO/wDff5jWlRRUnmzqVKjvObk/NhRRWRqmsJY4jRQ85GcdlHqaB0qU6s1CCu2a9FefPrGqOc/bHX2TCirtl4ivbdh52J0/J6djvllWIUbqUG+yZ2lFJb3ENxAksTbkYUtI81pptNWaCijeg/iFHmJ/fX86AswooDA9CKKBBRRRQAUUUUAFFFFABRRRQBi+IA5019vQSIX/AN2uGr1MgMCCAQaxrzwxauC8DmFvTqlUmetgMbSowdOpde9dSOHjd4nDxuyOOjKcGuisfEtzBhblBKvd14esq80y9ssmWLKA48xfmWqAp7nqzp4fEwu1Ga6NHplpf2t1GWglDHuOjD6ip68uRnR1dGKuvRlOCK6Ww8SSxYju1Lr/AM9UGG/EVNjycRlc43lRfMv5XudZRTYLiCeISQyK6noRTqR5bTTaas0FFFFAgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEkkSJHd2CqoySewFcRqGtz3RZIGaKD8mar/iS6YeVaLwCN7/0FcrVJHuZdhIcirTSbfwp9BMClooqj1wop0cbyuqR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J/uOkf8Aurk/maLMuGWYqW8Yx9X/AJHc1Sn1KwtuJblAf7o+Y/kK4Ca6urg/vriWT6sargAdBT5Trp5Sv+XlVvyijr5fE8aH/R7Zn93O0Vh3Gr6jcAhpyiHqsfy1mZAq/b6Zf3IzFbPt/vt8q07JHZHDYTDrm5Yr+9J/5lDAo747ntXWQeGh1uLnP+zH/ia37aytLVcQQKnq3Vj+NK5jVzOhDSF6j+5HG2uh31xguvkJ6v1/Kuns9EsbUq2DLIP43/oK1KKVzyq2PxFa65uWPaIUUUUjjCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAAgEEEAiqdxo+mzAs1sinsV+Un8quUUFwqVIO8Jyi/J2Ocm8MQcmC6df94BhWBf6ZcWHlmRkdXJAZa9CqveWUV7bPFIcZ5U9ww6EU0zvoZjWjOKqT5oX101PNKKuXlhdWTlZozt7SKMoapL8xCr8xPQDk1Z78ZRnHmi0490BBYbVGSeAPc16jChjhiT+6gH5CuX0jRpBIlzdLt28pGeufU11dQzwszxEKkoQg7qF7vzYVzviSSVbaBFJCSSEP+AyBXRVHc20FzC0Mqb1b8MH1FCOHD1I0q1Oco3UWeX4Apa7Q+GbIE/v5/zFKvh2wHVpj/wOndHuvM8L3k/kcVRXocfhvSwMtC/4uTT00vTkOVsof++c0XM3muH6QmzzgEHgcn25q5Fp9/N9y0lPuV2/+hYr0aOKKMYRFUeigCnUcxhLNn9iivmzi4vDeouNzmKIe7ZrSh8NWy/66eST2X5BXRUUrs5Z5jip/bUf8KKkGn2Vt/qraNT/AHsZb8zVuiikccpym7yk2+7dwooooJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoVEXOFA+goooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==\",\"originalPrice\":8.99,\"savings\":\"5.99\",\"discount\":67}', 0, NULL, '2025-09-30 14:31:28');
INSERT INTO `notifications` (`id`, `user_id`, `type`, `title`, `message`, `data`, `read_status`, `read_at`, `created_at`) VALUES
(113, 11, 'promotion', '🎉 ooooooooooo', 'ooooooooooooooooooo\n\n🏷️ Oppo A5 Pro\n💰 8.99 Dt → 6.99 Dt\n💸 Save 2.00 Dt (22% off!)', '{\"validUntil\":\"2025-10-02\",\"isPromotion\":true,\"productId\":52,\"salePrice\":6.99,\"productName\":\"A5 Pro\",\"productBrand\":\"Oppo\",\"productImage\":\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsLCwsMCwwODgwREhASERkXFRUXGSYbHRsdGyY6JCokJCokOjM+Mi8yPjNcSEBASFxqWVRZaoFzc4GimqLT0///2wBDAQsLCwsMCwwODgwREhASERkXFRUXGSYbHRsdGyY6JCokJCokOjM+Mi8yPjNcSEBASFxqWVRZaoFzc4GimqLT0///wAARCAM8AzwDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1yiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoqlNqdhBnfdR5H8IO4/kKy38S2iH91BLL9cIKdmbwwuIqfDSl+SOhorjn8TXpyIoYUB9cuaovreqv/AMvRT2QAUWZ1xyvEvdwj6s7+ivM2u7t87rqY/wDAzUB+Y5JJ+pzT5TZZQ+tdfKJ6gZol6yIPqwFN+1Wv/PxF/wB9rXl+1f7opdo9BRylrKIdaz/8BPUBc2x6XEX/AH2KesiN0dT9DXle1fQUbV/uijlB5RHpXf8A4Ceq1DdXUNrC8srYRfzJrzNWZPuOy/7rEfyp7zTyALJNI4ByAzE0collNpK9a8euljZufEF7Kx8jEKfQM1RRa9qkbAtOJR6OorHop2R6KwuGUeX2MLeh6RpWq217E2AUlTlkJq3Xm+n3D217byqcfOFb3VjgivSKlo8LHYaOHqrl+CSugooopHCFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRSSSRxKXd1VR1JOBWBceJIIsi1jMrdmb5UFBtSw9as7U4N+fQ6Csy61nT7YYM29/wC7H81cbdale3fEs52f3F+VaoVVj1aOVLerO/lE6OfxJdNkQQpGPVvnasWe7u7kkz3Ej+xPH5Cq2QKs29pdXRxBbySe4HH5mmehChh6CvGEY2+0/wDNlYAClroIfDl4x/fSxxew+c1rJ4bsY/8AWSTSH6hf5UXRlPMMLD/l5zP+6rnE8ClRWf7is3+6Ca9Fi0zTYR8lnHu/vEZP61dVVXoAKXMcs82h9ii36ux5vHYX8n3LOc/8ANWl0PVSM/ZCP95lFd9RSuYPNq3SlBfezhl8PaoescQ+slO/4R3UfWD/AL7P+FdvRRdkPNMT2h9xxLeG9TT/AJ4f991CdB1Qf8sUP0kFd5RRdgs0xPaD+R582j6ov/Lm5/3SGqnNb3FuQJoJIyem9cZr02oL2xgu4GhmyCeVYdUNO5tSzWfNFVKceXq0eZ0VqXWi6jbMcwNInZ4xmoYdM1GdgI7SX6sNo/M0z1lWouPMqsOXvcisYHuLy2iQZLSKfwU5NelVk6VpSWKl3IeZhgt2A9BWtUtngY/Exr1UofDBWT7hRRRSOAKKR3VEZnYKqjJJ6AVjf8JDpu/GZcf39ny0GtOjVq35KcpW3sjaoptvc288fmRSq49VNOoM2mm0000FFFFAgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACioZby0gOJbiJP95gKg/tTTP+f+3/AO+6DRUqsldU5NeSLtFUv7U0z/n/ALf/AL7FA1XTP+f+3/77oH7Ct/z6n/4Cy7RVMarpYBJvYCf98Uo1bTB/y/wf99igPY1v+fU//AWW6Kpf2rpv/P8A2/8A33R/ammf8/8Ab/8AfYoD2Nb/AJ9T/wDAWXaKrxahp7nCXcLt2UOKsUESjKPxRa9UcZ4lWf8AtBTISYyg8v0BHWufr0+7sIdQgMLjC9VYdQfWsKDwzBE2bicy+iqNgqkz2sLmFCGHjGekoK1ktzkIopZ32QxvI/ooya37Xw7cSc3Eqwj0X52rrooYoUCRRqijsoxT6LmFbNKstKUVBd3qzNttHsLbBWEO/wDff5jWlRRUnmzqVKjvObk/NhRRWRqmsJY4jRQ85GcdlHqaB0qU6s1CCu2a9FefPrGqOc/bHX2TCirtl4ivbdh52J0/J6djvllWIUbqUG+yZ2lFJb3ENxAksTbkYUtI81pptNWaCijeg/iFHmJ/fX86AswooDA9CKKBBRRRQAUUUUAFFFFABRRRQBi+IA5019vQSIX/AN2uGr1MgMCCAQaxrzwxauC8DmFvTqlUmetgMbSowdOpde9dSOHjd4nDxuyOOjKcGuisfEtzBhblBKvd14esq80y9ssmWLKA48xfmWqAp7nqzp4fEwu1Ga6NHplpf2t1GWglDHuOjD6ip68uRnR1dGKuvRlOCK6Ww8SSxYju1Lr/AM9UGG/EVNjycRlc43lRfMv5XudZRTYLiCeISQyK6noRTqR5bTTaas0FFFFAgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEkkSJHd2CqoySewFcRqGtz3RZIGaKD8mar/iS6YeVaLwCN7/0FcrVJHuZdhIcirTSbfwp9BMClooqj1wop0cbyuqR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J/uOkf8Aurk/maLMuGWYqW8Yx9X/AJHc1Sn1KwtuJblAf7o+Y/kK4Ca6urg/vriWT6sargAdBT5Trp5Sv+XlVvyijr5fE8aH/R7Zn93O0Vh3Gr6jcAhpyiHqsfy1mZAq/b6Zf3IzFbPt/vt8q07JHZHDYTDrm5Yr+9J/5lDAo747ntXWQeGh1uLnP+zH/ia37aytLVcQQKnq3Vj+NK5jVzOhDSF6j+5HG2uh31xguvkJ6v1/Kuns9EsbUq2DLIP43/oK1KKVzyq2PxFa65uWPaIUUUUjjCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAAgEEEAiqdxo+mzAs1sinsV+Un8quUUFwqVIO8Jyi/J2Ocm8MQcmC6df94BhWBf6ZcWHlmRkdXJAZa9CqveWUV7bPFIcZ5U9ww6EU0zvoZjWjOKqT5oX101PNKKuXlhdWTlZozt7SKMoapL8xCr8xPQDk1Z78ZRnHmi0490BBYbVGSeAPc16jChjhiT+6gH5CuX0jRpBIlzdLt28pGeufU11dQzwszxEKkoQg7qF7vzYVzviSSVbaBFJCSSEP+AyBXRVHc20FzC0Mqb1b8MH1FCOHD1I0q1Oco3UWeX4Apa7Q+GbIE/v5/zFKvh2wHVpj/wOndHuvM8L3k/kcVRXocfhvSwMtC/4uTT00vTkOVsof++c0XM3muH6QmzzgEHgcn25q5Fp9/N9y0lPuV2/+hYr0aOKKMYRFUeigCnUcxhLNn9iivmzi4vDeouNzmKIe7ZrSh8NWy/66eST2X5BXRUUrs5Z5jip/bUf8KKkGn2Vt/qraNT/AHsZb8zVuiikccpym7yk2+7dwooooJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoVEXOFA+goooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/2Q==\",\"originalPrice\":8.99,\"savings\":\"2.00\",\"discount\":22,\"ended\":true,\"endedAt\":\"2025-10-02T09:06:06.604Z\"}', 0, NULL, '2025-09-30 14:42:20'),
(115, 11, 'promotion', '🎉 bbbbbbbbbbb', 'bbbbbbbbbbbbbbbb\n\n🏷️ Google Google Pixel 8 Pro\n💰 899.99 Dt → 699.99 Dt\n💸 Save 200.00 Dt (22% off!)', '{\"validUntil\":\"2025-10-03\",\"isPromotion\":true,\"productId\":34,\"salePrice\":699.99,\"productName\":\"Google Pixel 8 Pro\",\"productBrand\":\"Google\",\"productImage\":\"https://images.unsplash.com/photo-1511707171631-9ed2a79be0f3?w=500\",\"originalPrice\":899.99,\"savings\":\"200.00\",\"discount\":22,\"ended\":true,\"endedAt\":\"2025-10-02T09:06:04.813Z\"}', 0, NULL, '2025-09-30 14:44:16'),
(124, 10, 'new_product', '🆕 New Product Available!', 'Check out the new Admin by Admin! Now available in our store starting at 0.01 DT.', '{\"productId\":53,\"productName\":\"Admin\",\"brand\":\"Admin\",\"price\":0.01,\"category\":\"phone\"}', 0, NULL, '2025-10-27 14:02:42'),
(125, 11, 'new_product', '🆕 New Product Available!', 'Check out the new Admin by Admin! Now available in our store starting at 0.01 DT.', '{\"productId\":53,\"productName\":\"Admin\",\"brand\":\"Admin\",\"price\":0.01,\"category\":\"phone\"}', 0, NULL, '2025-10-27 14:02:42');

-- --------------------------------------------------------

--
-- Structure de la table `notification_preferences`
--

CREATE TABLE `notification_preferences` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_updates` tinyint(1) DEFAULT 1,
  `stock_alerts` tinyint(1) DEFAULT 1,
  `price_drops` tinyint(1) DEFAULT 1,
  `new_products` tinyint(1) DEFAULT 0,
  `promotions` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notification_preferences`
--

INSERT INTO `notification_preferences` (`id`, `user_id`, `order_updates`, `stock_alerts`, `price_drops`, `new_products`, `promotions`, `created_at`, `updated_at`) VALUES
(7, 9, 1, 1, 1, 1, 1, '2025-09-30 14:17:14', '2025-09-30 14:17:14'),
(8, 10, 1, 1, 1, 1, 1, '2025-10-01 15:55:46', '2025-10-01 15:55:46'),
(9, 12, 1, 1, 1, 1, 1, '2025-12-06 15:19:52', '2025-12-06 15:19:52');

-- --------------------------------------------------------

--
-- Structure de la table `notification_templates`
--

CREATE TABLE `notification_templates` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('order_update','stock_alert','price_drop','promotion','new_product','system') NOT NULL,
  `title_template` varchar(255) NOT NULL,
  `message_template` text NOT NULL,
  `variables` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`variables`)),
  `active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notification_templates`
--

INSERT INTO `notification_templates` (`id`, `name`, `type`, `title_template`, `message_template`, `variables`, `active`, `created_at`, `updated_at`) VALUES
(1, 'Order Confirmed', 'order_update', 'Order Confirmed', 'Your order #{orderId} has been confirmed and is being processed.', '[\"orderId\", \"orderTotal\"]', 1, '2025-09-23 12:34:45', '2025-09-23 12:34:45'),
(2, 'Order Shipped', 'order_update', 'Order Shipped', 'Great news! Your order #{orderId} has been shipped and is on its way.', '[\"orderId\", \"trackingNumber\"]', 1, '2025-09-23 12:34:45', '2025-09-23 12:34:45'),
(3, 'Order Delivered', 'order_update', 'Order Delivered', 'Your order #{orderId} has been delivered. Thank you for shopping with us!', '[\"orderId\"]', 1, '2025-09-23 12:34:45', '2025-09-23 12:34:45'),
(4, 'Stock Alert', 'stock_alert', 'Back in Stock', '{productName} is now back in stock! Get it before it runs out again.', '[\"productName\", \"productId\", \"price\"]', 1, '2025-09-23 12:34:45', '2025-09-23 12:34:45'),
(5, 'Price Drop', 'price_drop', 'Price Drop Alert', 'Great news! {productName} price has dropped to {newPrice} Dt (was {oldPrice} Dt).', '[\"productName\", \"productId\", \"newPrice\", \"oldPrice\"]', 1, '2025-09-23 12:34:45', '2025-09-23 12:34:45'),
(6, 'Welcome', 'system', 'Welcome to RYM GSM!', 'Thank you for joining RYM GSM! Discover the latest smartphones and accessories.', '[]', 1, '2025-09-23 12:34:45', '2025-09-23 12:34:45'),
(7, 'Promotion', 'promotion', 'Special Offer', 'Don\'t miss out! {promotionTitle} - Save up to {discount}% on selected items.', '[\"promotionTitle\", \"discount\", \"validUntil\"]', 1, '2025-09-23 12:34:45', '2025-09-23 12:34:45');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `products` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`products`)),
  `total` decimal(10,2) NOT NULL,
  `status` enum('pending','shipped','delivered','cancelled') DEFAULT 'pending',
  `shipping_address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `payment_method` varchar(50) DEFAULT 'cash'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `products`, `total`, `status`, `shipping_address`, `created_at`, `updated_at`, `payment_method`) VALUES
(7, 9, '[{\"quantity\":29,\"price\":\"12.00\",\"name\":\"A5 Pro\"}]', 348.00, 'delivered', 'Admin User\n123 Admin St, City, State\nNabeul, 8000\nTunisia\nPhone: +1234567890\nEmail: admin@rymgsm.com', '2025-09-25 14:38:11', '2025-10-02 10:57:09', 'cash'),
(8, 11, '[{\"quantity\":1,\"price\":\"12.00\",\"name\":\"A5 Pro\"}]', 19.00, 'delivered', 'Ayoub kefi\nRue imem ibn arfa\nLa maison à côté de la mosquée au premier étage\nNabeul, 8000\nTunisia\nPhone: 25573007\nEmail: ayoubelkefi11@gmail.com', '2025-09-25 14:38:59', '2025-10-02 10:57:09', 'card'),
(9, 10, '[{\"quantity\":2,\"price\":\"12.00\",\"name\":\"A5 Pro\"}]', 31.00, 'delivered', 'John Doe\n456 User Ave, City, State\nNabeul, 8000\nTunisia\nPhone: +1234567891\nEmail: john@example.com', '2025-09-25 15:31:09', '2025-10-02 10:57:09', 'cash'),
(10, 9, '[{\"quantity\":1,\"price\":\"5.50\",\"name\":\"A5 Pro\"}]', 12.50, 'delivered', 'Admin User\n123 Admin St, City, State\nNabeul, 8000\nTunisia\nPhone: +1234567890\nEmail: admin@rymgsm.com', '2025-10-01 16:45:14', '2025-10-02 11:28:22', 'cash'),
(11, 9, '[{\"quantity\":1,\"price\":\"999.99\",\"name\":\"iPhone 15 Pro\"}]', 999.99, 'delivered', 'Admin User\n123 Admin St, City, State\nNabeul, 8000\nTunisia\nPhone: +1234567890\nEmail: admin@rymgsm.com', '2025-10-01 16:58:16', '2025-10-02 11:28:24', 'cash'),
(12, 9, '[{\"quantity\":1,\"price\":\"170.00\",\"name\":\"AirPods Pro (2nd Gen)\"}]', 170.00, '', 'Admin User\n123 Admin St, City, State\nNabeul, 8000\nTunisia\nPhone: +1234567890\nEmail: admin@rymgsm.com', '2025-10-02 11:30:14', '2025-10-02 11:30:14', 'card'),
(13, 9, '[{\"quantity\":11,\"price\":\"999.99\",\"name\":\"iPhone 15 Pro\"}]', 10999.89, 'delivered', 'Admin User\n123 Admin St, City, State\nNabeul, 8000\nTunisia\nPhone: +1234567890\nEmail: admin@rymgsm.com', '2025-10-02 14:07:43', '2025-10-02 14:08:09', 'cash'),
(14, 9, '[{\"quantity\":12,\"price\":\"0.01\",\"name\":\"Admin\"}]', 7.12, '', 'Admin User\n123 Admin St, City, State\nNabeul, 8000\nTunisia\nPhone: +1234567890\nEmail: admin@rymgsm.com', '2025-12-08 10:10:19', '2025-12-08 10:20:06', 'cash');

-- --------------------------------------------------------

--
-- Structure de la table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`) VALUES
(12, 7, 32, 2, 999.99, '2025-10-02 10:06:05'),
(13, 8, 32, 1, 999.99, '2025-10-02 10:06:05'),
(14, 8, 32, 1, 999.99, '2025-10-02 10:06:05'),
(15, 9, 33, 2, 1199.99, '2025-10-02 10:06:05'),
(16, 10, 33, 1, 1199.99, '2025-10-02 10:06:05'),
(17, 10, 35, 2, 170.00, '2025-10-02 10:06:05'),
(18, 11, 32, 1, 999.99, '2025-10-02 10:06:05'),
(19, 11, 32, 2, 999.99, '2025-10-02 10:06:05');

-- --------------------------------------------------------

--
-- Structure de la table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `category` enum('phone','accessory') DEFAULT 'phone',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`specs`)),
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `average_rating` decimal(3,2) DEFAULT 0.00,
  `review_count` int(11) DEFAULT 0,
  `original_price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT 50
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `product_associations`
--

CREATE TABLE `product_associations` (
  `id` int(11) NOT NULL,
  `product_a_id` int(11) NOT NULL,
  `product_b_id` int(11) NOT NULL,
  `association_strength` decimal(5,4) DEFAULT 0.0000,
  `co_purchase_count` int(11) DEFAULT 0,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `recommendation_cache`
--

CREATE TABLE `recommendation_cache` (
  `id` int(11) NOT NULL,
  `cache_key` varchar(255) NOT NULL,
  `recommendation_type` enum('collaborative','content_based','trending','cross_sell') NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `recommendations` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`recommendations`)),
  `expires_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `recommendation_cache`
--

INSERT INTO `recommendation_cache` (`id`, `cache_key`, `recommendation_type`, `user_id`, `product_id`, `recommendations`, `expires_at`, `created_at`) VALUES
(1, 'trending_6', 'trending', NULL, NULL, '[]', '2025-10-07 15:48:04', '2025-10-07 15:33:04');

-- --------------------------------------------------------

--
-- Structure de la table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('pending','approved','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `trending_products`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `trending_products` (
`id` int(11)
,`name` varchar(200)
,`brand` varchar(50)
,`price` decimal(10,2)
,`images` longtext
,`category` enum('phone','accessory')
,`recent_views` bigint(21)
,`recent_sales` int(1)
,`trending_score` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `role`, `created_at`, `updated_at`) VALUES
(9, 'Admin User', 'admin@rymgsm.com', '$2a$10$ZRT2TkbMiu3/kgWaVVreVu5qLFp8vPzS2wxm.oJxMmuKBYiuJyDua', '+1234567890', '123 Admin St, City, State', 'admin', '2025-09-23 13:14:14', '2025-09-23 13:14:14'),
(10, 'John Doe', 'john@example.com', '$2a$10$ZRT2TkbMiu3/kgWaVVreVu5qLFp8vPzS2wxm.oJxMmuKBYiuJyDua', '+1234567891', '456 User Ave, City, State', 'user', '2025-09-23 13:14:14', '2025-09-23 13:14:14'),
(11, 'Ayoub kefi', 'ayoubelkefi11@gmail.com', '$2a$10$dWHjeu0G8zlnVVP53RGd6eZm11AdZ.yVuD8LQ8RJILu/FaGK1hmgK', '25573007', 'Rue imem ibn arfa\nLa maison à côté de la mosquée au premier étage', 'user', '2025-09-25 14:36:16', '2025-09-25 14:36:16'),
(12, 'ayoub', 'anderzelnot@gmail.com', '$2a$10$wy661GlVfBEUuoMTeBLLbOVSwTnpxlNNoCqis4TVC6yeNiHjjI3FG', NULL, NULL, 'user', '2025-12-06 15:19:51', '2025-12-06 15:19:51');

-- --------------------------------------------------------

--
-- Structure de la table `user_cart_additions`
--

CREATE TABLE `user_cart_additions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `purchased` tinyint(1) DEFAULT 0,
  `order_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_preferences`
--

CREATE TABLE `user_preferences` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `preferred_brands` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferred_brands`)),
  `preferred_categories` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferred_categories`)),
  `price_range_min` decimal(10,2) DEFAULT NULL,
  `price_range_max` decimal(10,2) DEFAULT NULL,
  `favorite_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`favorite_features`)),
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user_product_views`
--

CREATE TABLE `user_product_views` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `view_count` int(11) DEFAULT 1,
  `last_viewed_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `user_purchase_history`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `user_purchase_history` (
`user_id` int(11)
,`order_id` int(11)
,`products` longtext
,`purchase_date` timestamp
,`status` enum('pending','shipped','delivered','cancelled')
);

-- --------------------------------------------------------

--
-- Structure de la table `user_searches`
--

CREATE TABLE `user_searches` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `search_query` varchar(500) NOT NULL,
  `results_count` int(11) DEFAULT 0,
  `clicked_product_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la vue `trending_products`
--
DROP TABLE IF EXISTS `trending_products`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `trending_products`  AS SELECT `p`.`id` AS `id`, `p`.`name` AS `name`, `p`.`brand` AS `brand`, `p`.`price` AS `price`, `p`.`images` AS `images`, `p`.`category` AS `category`, coalesce(`v`.`view_count`,0) AS `recent_views`, 0 AS `recent_sales`, coalesce(`v`.`view_count`,0) AS `trending_score` FROM (`products` `p` left join (select `user_product_views`.`product_id` AS `product_id`,count(0) AS `view_count` from `user_product_views` where `user_product_views`.`last_viewed_at` >= current_timestamp() - interval 7 day group by `user_product_views`.`product_id`) `v` on(`p`.`id` = `v`.`product_id`)) WHERE `p`.`stock_quantity` > 0 ORDER BY coalesce(`v`.`view_count`,0) DESC ;

-- --------------------------------------------------------

--
-- Structure de la vue `user_purchase_history`
--
DROP TABLE IF EXISTS `user_purchase_history`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `user_purchase_history`  AS SELECT `o`.`user_id` AS `user_id`, `o`.`id` AS `order_id`, `o`.`products` AS `products`, `o`.`created_at` AS `purchase_date`, `o`.`status` AS `status` FROM `orders` AS `o` WHERE `o`.`status` in ('completed','delivered') ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_session_id` (`session_id`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_read_status` (`read_status`),
  ADD KEY `idx_created_at` (`created_at`),
  ADD KEY `idx_type` (`type`);

--
-- Index pour la table `notification_preferences`
--
ALTER TABLE `notification_preferences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Index pour la table `notification_templates`
--
ALTER TABLE `notification_templates`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_orders` (`user_id`,`created_at`);

--
-- Index pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Index pour la table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `product_associations`
--
ALTER TABLE `product_associations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_association` (`product_a_id`,`product_b_id`),
  ADD KEY `idx_product_a` (`product_a_id`),
  ADD KEY `idx_product_b` (`product_b_id`),
  ADD KEY `idx_strength` (`association_strength`);

--
-- Index pour la table `recommendation_cache`
--
ALTER TABLE `recommendation_cache`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cache_key` (`cache_key`),
  ADD KEY `idx_cache_key` (`cache_key`),
  ADD KEY `idx_user_cache` (`user_id`),
  ADD KEY `idx_product_cache` (`product_id`),
  ADD KEY `idx_expires` (`expires_at`),
  ADD KEY `idx_type` (`recommendation_type`);

--
-- Index pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `user_cart_additions`
--
ALTER TABLE `user_cart_additions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_cart` (`user_id`),
  ADD KEY `idx_product_cart` (`product_id`),
  ADD KEY `idx_session` (`session_id`),
  ADD KEY `idx_purchased` (`purchased`);

--
-- Index pour la table `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `idx_user_prefs` (`user_id`),
  ADD KEY `idx_price_range` (`price_range_min`,`price_range_max`);

--
-- Index pour la table `user_product_views`
--
ALTER TABLE `user_product_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_product` (`user_id`,`product_id`),
  ADD KEY `idx_product_views` (`product_id`),
  ADD KEY `idx_session` (`session_id`),
  ADD KEY `idx_last_viewed` (`last_viewed_at`);

--
-- Index pour la table `user_searches`
--
ALTER TABLE `user_searches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_searches` (`user_id`),
  ADD KEY `idx_search_query` (`search_query`),
  ADD KEY `idx_session` (`session_id`),
  ADD KEY `clicked_product_id` (`clicked_product_id`);

--
-- Index pour la table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `chatbot_conversations`
--
ALTER TABLE `chatbot_conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT pour la table `notification_preferences`
--
ALTER TABLE `notification_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `notification_templates`
--
ALTER TABLE `notification_templates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT pour la table `product_associations`
--
ALTER TABLE `product_associations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `recommendation_cache`
--
ALTER TABLE `recommendation_cache`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `user_cart_additions`
--
ALTER TABLE `user_cart_additions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_preferences`
--
ALTER TABLE `user_preferences`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_product_views`
--
ALTER TABLE `user_product_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user_searches`
--
ALTER TABLE `user_searches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notification_preferences`
--
ALTER TABLE `notification_preferences`
  ADD CONSTRAINT `notification_preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Contraintes pour la table `product_associations`
--
ALTER TABLE `product_associations`
  ADD CONSTRAINT `product_associations_ibfk_1` FOREIGN KEY (`product_a_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `product_associations_ibfk_2` FOREIGN KEY (`product_b_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_cart_additions`
--
ALTER TABLE `user_cart_additions`
  ADD CONSTRAINT `user_cart_additions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_product_views`
--
ALTER TABLE `user_product_views`
  ADD CONSTRAINT `user_product_views_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `user_searches`
--
ALTER TABLE `user_searches`
  ADD CONSTRAINT `user_searches_ibfk_1` FOREIGN KEY (`clicked_product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `wishlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
