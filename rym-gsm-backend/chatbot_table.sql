-- Optional: Create table for storing chatbot conversations (for analytics)
-- Run this in your MySQL database if you want to track conversations

CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_session_id (session_id),
  INDEX idx_created_at (created_at)
);

-- This table is optional - the chatbot will work without it
-- It's useful for:
-- 1. Analytics on common questions
-- 2. Improving chatbot responses
-- 3. Customer support insights
