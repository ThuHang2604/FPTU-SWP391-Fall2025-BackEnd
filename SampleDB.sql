USE ev_trading_platform;

INSERT INTO categories (name, description)
VALUES
('Xe điện', 'Các dòng xe máy điện và xe đạp điện đã qua sử dụng.'),
('Pin', 'Pin xe điện, pin lithium-ion, và phụ kiện sạc.'),
('Phụ kiện', 'Mũ bảo hiểm, sạc, và phụ kiện cho xe điện.');

-- ========================
-- 5️⃣ INSERT PRODUCTS
-- ========================
INSERT INTO products (
    member_id, category_id, title, description, price,
    usage_duration, warranty_info, location,
    brand, model, year, mileage, battery_type,
    capacity, cycle_count, compatible_with, status
)
VALUES
-- Xe điện
(1, 1, 'Xe điện VinFast Klara S cũ', 'Xe chạy ổn định, bảo dưỡng định kỳ, ngoại hình còn 90%.', 18500000,
 '8 tháng', 'Còn bảo hành 4 tháng', 'Hà Nội', 'VinFast', 'Klara S', 2023, 3200, 'Lithium-ion',
 NULL, NULL, NULL, 'APPROVED'),

(2, 1, 'Xe máy điện Yadea ULike', 'Xe nhẹ, tiết kiệm điện, phù hợp di chuyển trong nội thành.', 13500000,
 '1 năm', 'Hết bảo hành', 'TP.HCM', 'Yadea', 'ULike', 2022, 5400, 'Lithium-ion',
 NULL, NULL, NULL, 'APPROVED'),

-- Pin xe điện
(2, 2, 'Pin Lithium 60V - 20Ah', 'Pin zin tháo xe, sạc xả dưới 300 lần, hoạt động tốt.', 3500000,
 '10 tháng', 'Không bảo hành', 'TP.HCM', NULL, NULL, NULL, NULL, NULL,
 '60V - 20Ah', 280, 'VinFast, Yadea', 'APPROVED'),

(3, 2, 'Pin 48V - 12Ah cho xe đạp điện', 'Pin nhẹ, dung lượng tốt, sạc nhanh.', 1500000,
 '1 năm', NULL, 'Đà Nẵng', NULL, NULL, NULL, NULL, NULL,
 '48V - 12Ah', 400, 'Xe đạp điện Asama, Nijia', 'APPROVED'),

-- Phụ kiện
(1, 3, 'Sạc xe điện đa năng', 'Tương thích nhiều dòng pin khác nhau, hiệu suất cao.', 450000,
 'Mới 3 tháng', 'Bảo hành 6 tháng', 'Hà Nội', NULL, NULL, NULL, NULL, NULL,
 NULL, NULL, NULL, 'APPROVED'),

(3, 3, 'Mũ bảo hiểm xe điện 3/4', 'Mũ nhẹ, bền, kính chắn gió tốt.', 350000,
 'Mới', NULL, 'Đà Nẵng', NULL, NULL, NULL, NULL, NULL,
 NULL, NULL, NULL, 'APPROVED');

-- ========================
-- 6️⃣ INSERT PRODUCT MEDIA (UPDATED IMAGES)
-- ========================
INSERT INTO product_media (product_id, media_url, media_type)
VALUES
-- VinFast Klara S
(1, 'https://i.pinimg.com/736x/1b/a5/42/1ba54211b20831ea48fb15fec0d5fce8.jpg', 'IMAGE'),
(1, 'https://i.pinimg.com/736x/1b/a5/42/1ba54211b20831ea48fb15fec0d5fce8.jpg', 'IMAGE'),

-- Yadea ULike
(2, 'https://i.pinimg.com/736x/1b/a5/42/1ba54211b20831ea48fb15fec0d5fce8.jpg', 'IMAGE'),
(2, 'https://i.pinimg.com/736x/1b/a5/42/1ba54211b20831ea48fb15fec0d5fce8.jpg', 'IMAGE'),

-- Pin 60V
(3, 'https://i.pinimg.com/736x/db/6a/25/db6a25cacccde9ced956526c623a637b.jpg', 'IMAGE'),

-- Pin 48V
(4, 'https://i.pinimg.com/736x/db/6a/25/db6a25cacccde9ced956526c623a637b.jpg', 'IMAGE'),

-- Sạc xe điện
(5, 'https://example.com/images/sac-xe-dien.jpg', 'IMAGE'),

-- Mũ bảo hiểm
(6, 'https://example.com/images/mu-bao-hiem.jpg', 'IMAGE');