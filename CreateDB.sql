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

-- Bảng Category
CREATE TABLE categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Product
CREATE TABLE products (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id       BIGINT NOT NULL, -- Người đăng
    category_id     BIGINT NOT NULL, -- Danh mục
    
    title           VARCHAR(200) NOT NULL, -- Tiêu đề tin
    description     TEXT,
    price           DECIMAL(15,2) NOT NULL,
    
    -- Thông tin chung
    usage_duration  VARCHAR(100), -- Thời gian sử dụng, ví dụ: "6 tháng"
    warranty_info   VARCHAR(255), -- Bảo hành (nếu có)
    location        VARCHAR(255), -- Địa chỉ bán

    -- Thông tin riêng cho xe điện
    brand           VARCHAR(100), -- Hãng xe (Yadea, VinFast, Honda…)
    model           VARCHAR(100), -- Dòng xe
    year            YEAR, -- Năm sản xuất
    mileage         INT, -- Số km đã đi
    battery_type    VARCHAR(100), 

    -- Thông tin riêng cho pin
    capacity        VARCHAR(100), -- Dung lượng pin (ví dụ: 60V - 20Ah)
    cycle_count     INT, -- Số lần sạc xả
    compatible_with VARCHAR(255), -- Tương thích với xe nào

    -- Quản lý trạng thái
    status          ENUM('PENDING', 'APPROVED', 'REJECTED', 'SOLD', 'INACTIVE') DEFAULT 'PENDING',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_product_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Bảng Product Media
CREATE TABLE product_media (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id  BIGINT NOT NULL,
    media_url   VARCHAR(255) NOT NULL,
    media_type  ENUM('IMAGE', 'VIDEO') DEFAULT 'IMAGE',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_media_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Bảng Product Approvals (lịch sử duyệt sản phẩm)
CREATE TABLE product_approvals (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id    BIGINT NOT NULL,
    admin_id      BIGINT NOT NULL,
    action        ENUM('APPROVED', 'REJECTED') NOT NULL,
    reason        TEXT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_approval_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_approval_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);