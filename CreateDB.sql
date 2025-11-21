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
    full_name        VARCHAR(100) NOT NULL,
    email            VARCHAR(100) NOT NULL UNIQUE,
    password         VARCHAR(255),
    google_id        VARCHAR(255) UNIQUE,                  
    login_provider   ENUM('LOCAL', 'GOOGLE') DEFAULT 'LOCAL', 
    phone            VARCHAR(20) UNIQUE,
    avatar           VARCHAR(255),
    role             ENUM('MEMBER', 'ADMIN') DEFAULT 'MEMBER',
    status           ENUM('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- MEMBERS
-- ==========================================
CREATE TABLE members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id          BIGINT NOT NULL,
    address          VARCHAR(255),
    city             VARCHAR(100),
    country          VARCHAR(100) DEFAULT 'Vietnam',
    wallet_balance   DECIMAL(15,2) DEFAULT 0.00,
    status           ENUM('ACTIVE', 'SUSPENDED', 'PENDING') DEFAULT 'ACTIVE',
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
-- PRODUCTS
-- ==========================================
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id       BIGINT NOT NULL,               
    category_id     BIGINT NOT NULL,               
    buyer_id        BIGINT,                        

    title           VARCHAR(200) NOT NULL,         
    description     TEXT,                          
    price           DECIMAL(15,2) NOT NULL,        
    location        VARCHAR(255),                  

    usage_duration   VARCHAR(100),                  
    warranty_info    VARCHAR(255),                  
    condition_status VARCHAR(255),                  
    origin           VARCHAR(255),                  
    product_type     ENUM('BATTERY','ELECTRIC_BIKE','ELECTRIC_CAR') NOT NULL,  

    -- Battery info
    battery_type         VARCHAR(100),              
    battery_voltage      VARCHAR(50),               
    battery_capacity     VARCHAR(50),               
    battery_pack_config  VARCHAR(50),               
    cycle_count          INT,                       
    efficiency_remain    VARCHAR(50),               
    repaired_or_modified BOOLEAN DEFAULT FALSE,     
    compatible_with      VARCHAR(255),              

    -- Car info
    brand                VARCHAR(100),              
    model                VARCHAR(100),              
    variant              VARCHAR(100),              
    year_of_manufacture  YEAR,                      
    transmission         VARCHAR(50),               
    color                VARCHAR(50),               
    body_type            VARCHAR(100),              
    seat_count           INT,                       
    mileage              INT,                       
    license_plate        VARCHAR(50),               
    num_of_owners        INT,                       
    accessories_included BOOLEAN DEFAULT FALSE,     
    registration_valid   BOOLEAN DEFAULT FALSE,     

    -- Bike info
    bike_type         ENUM('ELECTRIC_MOTORBIKE','ELECTRIC_BICYCLE'),  
    motor_power       VARCHAR(50),                  
    top_speed         VARCHAR(50),                  
    range_per_charge  VARCHAR(50),                  
    charging_time     VARCHAR(50),                  
    frame_type        VARCHAR(100),                 
    brake_type        VARCHAR(100),                 
    tire_size         VARCHAR(50),                  
    has_battery_included BOOLEAN DEFAULT TRUE,      

    status ENUM('PENDING','APPROVED','REJECTED','SOLD','INACTIVE') DEFAULT 'PENDING',
    is_paid TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Đã thanh toán', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES members(id) ON DELETE SET NULL,

    INDEX idx_member (member_id),
    INDEX idx_buyer (buyer_id),
    INDEX idx_status (status)
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
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50),
    paypal_capture_id VARCHAR(255), 
    refund_reason VARCHAR(255),
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    paypal_order_id VARCHAR(255),
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
-- CHATBOXES (ĐÃ SỬA)
-- Thêm lại cột ID để khớp với Sequelize Model
-- ==========================================
CREATE TABLE chatboxes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- Bắt buộc phải có ID cho Sequelize
    product_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Ràng buộc Unique thay cho Composite PK để đảm bảo logic nghiệp vụ
    UNIQUE KEY unique_chat_session (product_id, seller_id, buyer_id),
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES members(id) ON DELETE CASCADE
);

-- ==========================================
-- CHAT_MESSAGES 
-- ==========================================
CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chatbox_id BIGINT NOT NULL, -- Reference đến ID của bảng chatboxes
    sender_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (chatbox_id) REFERENCES chatboxes(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES members(id) ON DELETE CASCADE,
    
    INDEX idx_chatbox (chatbox_id)
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
    action ENUM('APPROVED','REJECTED') NOT NULL, 
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
);