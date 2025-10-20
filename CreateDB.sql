-- ==========================================
-- CREATE DATABASE
-- ==========================================
DROP DATABASE IF EXISTS ev_trading_platform;
CREATE DATABASE ev_trading_platform
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE ev_trading_platform;

-- ==========================================
-- USERS
-- ==========================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(100) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    phone           VARCHAR(20) UNIQUE,
    avatar          VARCHAR(255),
    role            ENUM('MEMBER', 'ADMIN') DEFAULT 'MEMBER',
    status          ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- MEMBERS
-- ==========================================
CREATE TABLE members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    phone_number    VARCHAR(20),
    address         VARCHAR(255),
    city            VARCHAR(100),
    country         VARCHAR(100) DEFAULT 'Vietnam',
    avatar_url      VARCHAR(255),
    wallet_balance  DECIMAL(15,2) DEFAULT 0.00,
    status          ENUM('ACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'ACTIVE',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- ADMINS
-- ==========================================
CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================
-- CATEGORIES
-- ==========================================
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- PRODUCTS (chi tiết có chú thích)
-- ==========================================
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id       BIGINT NOT NULL,              -- người đăng bán (FK -> members.id)
    category_id     BIGINT NOT NULL,              -- danh mục sản phẩm (FK -> categories.id)

    title           VARCHAR(200) NOT NULL,        -- tiêu đề bài đăng
    description     TEXT,                         -- mô tả chi tiết
    price           DECIMAL(15,2) NOT NULL,       -- giá sản phẩm
    location        VARCHAR(255),                 -- địa điểm bán

    -- thông tin chung
    usage_duration  VARCHAR(100),                 -- thời gian sử dụng (VD: 2 năm)
    warranty_info   VARCHAR(255),                 -- thông tin bảo hành (VD: còn 6 tháng)
    condition_status VARCHAR(255),                -- tình trạng (mới, đã dùng, tân trang, ...)
    origin          VARCHAR(255),                 -- xuất xứ sản phẩm
    product_type    ENUM('BATTERY','ELECTRIC_BIKE','ELECTRIC_CAR') NOT NULL,  -- loại sản phẩm chính

    -- thông tin pin
    battery_type        VARCHAR(100),             -- loại pin (Li-ion, LFP, ...)
    battery_voltage     VARCHAR(50),              -- điện áp (VD: 48V, 72V)
    battery_capacity    VARCHAR(50),              -- dung lượng (VD: 20Ah)
    battery_pack_config VARCHAR(50),              -- cấu hình pack (VD: 10S6P)
    cycle_count         INT,                      -- số chu kỳ sạc
    efficiency_remain   VARCHAR(50),              -- hiệu suất còn lại (VD: 85%)
    repaired_or_modified BOOLEAN DEFAULT FALSE,   -- đã từng sửa hoặc độ (TRUE/FALSE)
    compatible_with     VARCHAR(255),             -- tương thích với model nào (nếu là pin rời)

    -- thông tin ô tô điện
    brand               VARCHAR(100),             -- hãng xe (VD: VinFast, Tesla)
    model               VARCHAR(100),             -- model (VD: VF e34)
    variant             VARCHAR(100),             -- phiên bản (VD: Plus)
    year_of_manufacture YEAR,                     -- năm sản xuất
    transmission        VARCHAR(50),              -- hộp số (VD: tự động, 1 cấp)
    color               VARCHAR(50),              -- màu xe
    body_type           VARCHAR(100),             -- kiểu thân xe (SUV, sedan, ...)
    seat_count          INT,                      -- số chỗ ngồi
    mileage             INT,                      -- số km đã đi
    license_plate       VARCHAR(50),              -- biển số (nếu có)
    num_of_owners       INT,                      -- số chủ sở hữu trước
    accessories_included BOOLEAN DEFAULT FALSE,   -- có kèm phụ kiện (TRUE/FALSE)
    registration_valid  BOOLEAN DEFAULT FALSE,    -- giấy tờ còn hiệu lực

    -- thông tin xe máy/xe đạp điện
    bike_type       ENUM('ELECTRIC_MOTORBIKE','ELECTRIC_BICYCLE'),  -- loại xe hai bánh
    motor_power     VARCHAR(50),                 -- công suất động cơ (VD: 1500W)
    top_speed       VARCHAR(50),                 -- tốc độ tối đa (VD: 70 km/h)
    range_per_charge VARCHAR(50),                -- quãng đường mỗi lần sạc (VD: 80 km)
    charging_time   VARCHAR(50),                 -- thời gian sạc (VD: 5 giờ)
    frame_type      VARCHAR(100),                -- loại khung (thép, nhôm, ...)
    brake_type      VARCHAR(100),                -- loại phanh (đĩa, cơ, ...)
    tire_size       VARCHAR(50),                 -- kích thước lốp (VD: 12 inch)
    has_battery_included BOOLEAN DEFAULT TRUE,   -- có pin kèm theo không

    status ENUM('PENDING','APPROVED','REJECTED','SOLD','INACTIVE') DEFAULT 'PENDING', -- trạng thái duyệt/bán
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ==========================================
-- PRODUCT_MEDIA
-- ==========================================
CREATE TABLE product_media (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    media_type ENUM('IMAGE','VIDEO') DEFAULT 'IMAGE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ==========================================
-- PAYMENTS
-- ==========================================
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    product_id BIGINT,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('PENDING','COMPLETED','FAILED') DEFAULT 'PENDING',
    paypal_order_id VARCHAR(255), -- ID giao dịch PayPal
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- ==========================================
-- PAYMENT_HISTORY
-- ==========================================
CREATE TABLE payment_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    payment_id BIGINT NOT NULL,
    status ENUM('INITIATED','PROCESSING','SUCCESS','FAILED') NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE
);

-- ==========================================
-- REVIEWS
-- ==========================================
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ==========================================
-- CHATBOX & MESSAGES
-- ==========================================
CREATE TABLE chatboxes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    host_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (host_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatbox_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (chatbox_id) REFERENCES chatboxes(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES members(id) ON DELETE CASCADE
);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

-- ==========================================
-- PRODUCT_APPROVALS
-- ==========================================
CREATE TABLE product_approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    admin_id BIGINT NOT NULL,
    action ENUM('APPROVED','REJECTED') NOT NULL,  -- hành động duyệt
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);
