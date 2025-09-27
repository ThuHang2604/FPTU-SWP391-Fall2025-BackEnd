-- Tạo Database
CREATE DATABASE IF NOT EXISTS ev_trading_platform
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ev_trading_platform;

-- Bảng User (chung)
CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    email         VARCHAR(100) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL,
    phone         VARCHAR(20),
    role          ENUM('MEMBER', 'ADMIN') NOT NULL DEFAULT 'MEMBER',
    status        ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Member (chỉ mở rộng cho role = MEMBER)
CREATE TABLE members (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    address     VARCHAR(255),
    CONSTRAINT fk_member_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bảng Admin (chỉ mở rộng cho role = ADMIN)
CREATE TABLE admins (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    CONSTRAINT fk_admin_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);