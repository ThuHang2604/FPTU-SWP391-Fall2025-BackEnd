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

-- Chỉnh lại địa chỉ product
UPDATE products SET location = 'Số 12, đường Nguyễn Trãi, phường Thượng Đình, quận Thanh Xuân, Hà Nội' WHERE id = 1;
UPDATE products SET location = '45 Nguyễn Thị Minh Khai, phường Bến Nghé, quận 1, TP.HCM' WHERE id = 2;
UPDATE products SET location = '18 Lê Duẩn, phường Hải Châu 1, quận Hải Châu, Đà Nẵng' WHERE id = 3;

UPDATE products SET location = 'Số 215, đường Phạm Văn Đồng, phường Cổ Nhuế 1, quận Bắc Từ Liêm, Hà Nội' WHERE id = 4;
UPDATE products SET location = '102 Nguyễn Văn Trỗi, phường 8, quận Phú Nhuận, TP.HCM' WHERE id = 5;
UPDATE products SET location = '23 Nguyễn Trãi, phường Cái Khế, quận Ninh Kiều, Cần Thơ' WHERE id = 6;

UPDATE products SET location = '62 Láng Hạ, phường Thành Công, quận Ba Đình, Hà Nội' WHERE id = 7;
UPDATE products SET location = '117 Lý Thường Kiệt, phường 7, quận Tân Bình, TP.HCM' WHERE id = 8;
UPDATE products SET location = '21 Trần Phú, phường Thạch Thang, quận Hải Châu, Đà Nẵng' WHERE id = 9;
UPDATE products SET location = '55 Lê Lợi, phường Phú Nhuận, TP. Huế' WHERE id = 10;

-- Chỉnh sửa hình ảnh cho phù hợp sản phẩm
-- Cập nhật ảnh cho XE MÁY ĐIỆN (ELECTRIC_MOTORBIKE)
UPDATE product_media pm
JOIN products p ON pm.product_id = p.id
SET pm.media_url = 'https://i.pinimg.com/736x/9b/be/00/9bbe005374cb1b4010c5dbff7b31a511.jpg'
WHERE p.product_type = 'ELECTRIC_BIKE'
  AND p.bike_type = 'ELECTRIC_MOTORBIKE';

-- Cập nhật ảnh cho XE ĐẠP ĐIỆN (ELECTRIC_BICYCLE)
UPDATE product_media pm
JOIN products p ON pm.product_id = p.id
SET pm.media_url = 'https://i.pinimg.com/1200x/46/98/27/4698273614cb5ea8668f7c63a0411129.jpg'
WHERE p.product_type = 'ELECTRIC_BIKE'
  AND p.bike_type = 'ELECTRIC_BICYCLE';

-- Cập nhật ảnh cho Ô TÔ ĐIỆN (ELECTRIC_CAR)
UPDATE product_media pm
JOIN products p ON pm.product_id = p.id
SET pm.media_url = 'https://i.pinimg.com/736x/b1/c5/77/b1c577cee64d437d5b578d9b69d9f82a.jpg'
WHERE p.product_type = 'ELECTRIC_CAR';