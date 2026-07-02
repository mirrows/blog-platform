-- 创建数据库
CREATE DATABASE IF NOT EXISTS `blog` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `blog`;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `role` ENUM('admin', 'user') DEFAULT 'user',
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 分类表
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 标签表
CREATE TABLE IF NOT EXISTS `tags` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `slug` VARCHAR(50) NOT NULL UNIQUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章表
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `content` TEXT NOT NULL,
  `summary` TEXT DEFAULT NULL,
  `cover_image` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  `is_top` TINYINT(1) DEFAULT 0,
  `view_count` INT UNSIGNED DEFAULT 0,
  `like_count` INT UNSIGNED DEFAULT 0,
  `comment_count` INT UNSIGNED DEFAULT 0,
  `author_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED DEFAULT NULL,
  `published_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_author` (`author_id`),
  INDEX `idx_category` (`category_id`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS `post_tags` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT UNSIGNED NOT NULL,
  `tag_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_post_tag` (`post_id`, `tag_id`),
  INDEX `idx_post_id` (`post_id`),
  INDEX `idx_tag_id` (`tag_id`),
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论表
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `content` TEXT NOT NULL,
  `nickname` VARCHAR(50) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  `parent_id` INT UNSIGNED DEFAULT NULL,
  `post_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_post` (`post_id`),
  INDEX `idx_user` (`user_id`),
  INDEX `idx_status` (`status`),
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 点赞表
CREATE TABLE IF NOT EXISTS `likes` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `post_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
  INDEX `idx_post` (`post_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 收藏表
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `post_id` INT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
  INDEX `idx_post` (`post_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 访问日志表
CREATE TABLE IF NOT EXISTS `visit_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `ip_address` VARCHAR(45) NOT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `referer` VARCHAR(255) DEFAULT NULL,
  `post_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_post` (`post_id`),
  INDEX `idx_created` (`created_at`),
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文件表
CREATE TABLE IF NOT EXISTS `files` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(255) NOT NULL,
  `original_name` VARCHAR(255) NOT NULL,
  `path` VARCHAR(500) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `mime_type` VARCHAR(100) NOT NULL,
  `size` BIGINT UNSIGNED NOT NULL,
  `uploader_id` INT UNSIGNED DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_uploader` (`uploader_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入默认管理员账号（密码: admin123）
-- 注意：密码哈希由 init-db.js 动态生成，这里使用占位符
INSERT INTO `users` (`username`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`)
VALUES ('admin', 'admin@example.com', 'temp_password_hash', 'admin', 'active', NOW(), NOW())
ON DUPLICATE KEY UPDATE `username` = `username`;

-- 插入示例分类
INSERT INTO `categories` (`name`, `slug`, `description`, `created_at`, `updated_at`) VALUES
('技术', 'tech', '技术相关文章', NOW(), NOW()),
('生活', 'life', '生活随笔', NOW(), NOW()),
('旅行', 'travel', '旅行日记', NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = `name`;

-- 插入示例标签
INSERT INTO `tags` (`name`, `slug`, `created_at`, `updated_at`) VALUES
('JavaScript', 'javascript', NOW(), NOW()),
('Vue', 'vue', NOW(), NOW()),
('Node.js', 'nodejs', NOW(), NOW()),
('生活感悟', 'life', NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = `name`;
