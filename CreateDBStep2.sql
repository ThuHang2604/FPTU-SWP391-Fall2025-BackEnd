-- 1) Chọn DB
USE ev_trading_platform;

-- 2) Thêm cột
ALTER TABLE products
ADD COLUMN is_paid TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Đã thanh toán' AFTER status;

-- 3) Kiểm tra
SHOW COLUMNS FROM products LIKE 'is_paid';
--
--CHỈNH CỬA DB CHO ĐĂNG NHẬP GOOGLE
USE ev_trading_platform;

ALTER TABLE users
ADD COLUMN google_id VARCHAR(255) UNIQUE AFTER email,
ADD COLUMN login_provider ENUM('LOCAL', 'GOOGLE') DEFAULT 'LOCAL' AFTER password;
