USE ev_trading_platform;

-- =========================
-- NGƯỜI DÙNG MẪU
-- =========================

-- 1. Admin
INSERT INTO users (full_name, email, password, phone, avatar, role, status)
VALUES 
('Admin System', 'admin@example.com', 
'$2b$10$OsESrJbKm4ra8F50yw8S2eezgP3ZqFJUy8Zmhuqe3VEYYkZ2jKi7S', 
'0900000001',
'https://i.pinimg.com/736x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
'ADMIN', 'ACTIVE');

-- 2. Member
INSERT INTO users (full_name, email, password, phone, avatar, role, status)
VALUES 
('User Test', 'user@example.com', 
'$2b$10$OsESrJbKm4ra8F50yw8S2eezgP3ZqFJUy8Zmhuqe3VEYYkZ2jKi7S',
'0900000002',
'https://i.pinimg.com/736x/08/33/b9/0833b999afd16f9266d4af47d18a8ae5.jpg',
'MEMBER', 'ACTIVE');

-- Thêm bản ghi vào bảng members
INSERT INTO members (user_id, address, city, country, wallet_balance, status)
VALUES 
(2, '123 Nguyễn Trãi', 'Hà Nội', 'Vietnam', 500000.00, 'ACTIVE');

-- Thêm bản ghi vào bảng admins
INSERT INTO admins (user_id)
VALUES (1);

-- =========================
-- DANH MỤC SẢN PHẨM
-- =========================
INSERT INTO categories (name, description) VALUES
('Pin', 'Các loại pin xe điện, pin lithium-ion, pin thay thế.'),
('Xe ô tô điện', 'Xe ô tô chạy bằng năng lượng điện, thân thiện môi trường.'),
('Xe máy / Xe đạp điện', 'Xe máy điện, xe đạp điện tiết kiệm năng lượng.');

-- =========================
-- SẢN PHẨM MẪU (10 sản phẩm)
-- =========================

-- 1-3: PIN
INSERT INTO products (
  member_id, category_id, title, description, price, location,
  usage_duration, warranty_info, condition_status, origin, product_type,
  battery_type, battery_voltage, battery_capacity, battery_pack_config,
  cycle_count, efficiency_remain, repaired_or_modified, compatible_with, status
) VALUES
(1, 1, 'Pin Lithium-ion 60V - Dung lượng cao', 'Pin phù hợp cho xe máy điện, sạc nhanh, bền bỉ.', 4500000, 'Hà Nội',
'6 tháng', 'Bảo hành 3 tháng', 'Tốt', 'Việt Nam', 'BATTERY',
'Lithium-ion', '60V', '20Ah', '10S2P', 150, '90%', FALSE, 'VinFast Klara S', 'APPROVED'),
(1, 1, 'Pin thay thế xe đạp điện 48V', 'Dung lượng 12Ah, tương thích nhiều dòng xe đạp điện phổ biến.', 2800000, 'TP.HCM',
'1 năm', 'Bảo hành 6 tháng', 'Tốt', 'Trung Quốc', 'BATTERY',
'Lithium-ion', '48V', '12Ah', '8S2P', 200, '85%', FALSE, 'Xmen, JVC', 'APPROVED'),
(1, 1, 'Pin năng lượng cao 72V cho xe máy điện', 'Dòng pin cao cấp, hỗ trợ quãng đường xa.', 5200000, 'Đà Nẵng',
'3 tháng', 'Không bảo hành', 'Khá', 'Việt Nam', 'BATTERY',
'Lithium-ion', '72V', '30Ah', '12S2P', 100, '95%', FALSE, 'Yadea, VinFast', 'APPROVED');

-- 4-6: Ô TÔ ĐIỆN
INSERT INTO products (
  member_id, category_id, title, description, price, location,
  usage_duration, warranty_info, condition_status, origin, product_type,
  brand, model, variant, year_of_manufacture, transmission, color,
  body_type, seat_count, mileage, license_plate, num_of_owners,
  accessories_included, registration_valid, status
) VALUES
(1, 2, 'VinFast VF e34 đã qua sử dụng', 'Xe chạy ổn định, pin thuê, màu xanh.', 620000000, 'Hà Nội',
'2 năm', 'Bảo hành 6 tháng', 'Tốt', 'Việt Nam', 'ELECTRIC_CAR',
'VinFast', 'VF e34', 'Tiêu chuẩn', 2022, 'Tự động', 'Xanh dương', 
'SUV', 5, 23000, '30G-12345', 1, TRUE, TRUE, 'APPROVED'),
(1, 2, 'Tesla Model 3 cũ - nhập Mỹ', 'Xe nhập khẩu, pin còn tốt, nội thất sang trọng.', 890000000, 'TP.HCM',
'3 năm', 'Không bảo hành', 'Khá', 'Mỹ', 'ELECTRIC_CAR',
'Tesla', 'Model 3', 'Standard Range', 2021, 'Tự động', 'Trắng',
'Sedan', 5, 41000, '51H-67890', 2, TRUE, TRUE, 'APPROVED'),
(1, 2, 'BYD Dolphin - xe điện tiết kiệm', 'Xe điện giá tốt, phù hợp đi lại trong thành phố.', 450000000, 'Cần Thơ',
'1 năm', 'Bảo hành 1 năm', 'Rất tốt', 'Trung Quốc', 'ELECTRIC_CAR',
'BYD', 'Dolphin', 'Base', 2023, 'Tự động', 'Bạc',
'Hatchback', 5, 8000, '65A-99999', 1, TRUE, TRUE, 'APPROVED');

-- 7-10: XE MÁY / XE ĐẠP ĐIỆN
INSERT INTO products (
  member_id, category_id, title, description, price, location,
  usage_duration, warranty_info, condition_status, origin, product_type,
  bike_type, motor_power, top_speed, range_per_charge, charging_time,
  frame_type, brake_type, tire_size, has_battery_included, status
) VALUES
(1, 3, 'VinFast Klara S - xe máy điện cũ', 'Xe chạy ổn, pin thuê, ít trầy xước.', 21000000, 'Hà Nội',
'1 năm', 'Không bảo hành', 'Tốt', 'Việt Nam', 'ELECTRIC_BIKE',
'ELECTRIC_MOTORBIKE', '1500W', '70 km/h', '100 km', '5 tiếng', 'Thép', 'Phanh đĩa', '14 inch', TRUE, 'APPROVED'),
(1, 3, 'YADEA E3 - xe máy điện giá rẻ', 'Xe phù hợp học sinh, pin lithium mới thay.', 13500000, 'TP.HCM',
'6 tháng', 'Bảo hành 3 tháng', 'Tốt', 'Trung Quốc', 'ELECTRIC_BIKE',
'ELECTRIC_MOTORBIKE', '1000W', '50 km/h', '80 km', '4 tiếng', 'Nhôm', 'Phanh tang trống', '12 inch', TRUE, 'APPROVED'),
(1, 3, 'JVC Eco - xe đạp điện tiết kiệm', 'Xe đạp điện nhẹ, phù hợp đi học.', 7500000, 'Đà Nẵng',
'1 năm', 'Không bảo hành', 'Khá', 'Việt Nam', 'ELECTRIC_BIKE',
'ELECTRIC_BICYCLE', '350W', '35 km/h', '60 km', '5 tiếng', 'Thép', 'Phanh tang trống', '14 inch', TRUE, 'APPROVED'),
(1, 3, 'Pega Aura - xe máy điện sang trọng', 'Thiết kế thời trang, yên rộng.', 27000000, 'Huế',
'8 tháng', 'Bảo hành 6 tháng', 'Rất tốt', 'Việt Nam', 'ELECTRIC_BIKE',
'ELECTRIC_MOTORBIKE', '2000W', '75 km/h', '120 km', '6 tiếng', 'Nhôm', 'Phanh đĩa', '14 inch', TRUE, 'APPROVED');

-- =========================
-- HÌNH ẢNH SẢN PHẨM
-- =========================
INSERT INTO product_media (product_id, media_url, media_type) VALUES
(1, 'https://i.pinimg.com/736x/cb/2f/f2/cb2ff25a0b87274fb7e69d831f32a14d.jpg', 'IMAGE'),
(2, 'https://i.pinimg.com/736x/cb/2f/f2/cb2ff25a0b87274fb7e69d831f32a14d.jpg', 'IMAGE'),
(3, 'https://i.pinimg.com/736x/cb/2f/f2/cb2ff25a0b87274fb7e69d831f32a14d.jpg', 'IMAGE'),
(4, 'https://i.pinimg.com/736x/1b/a5/42/1ba54211b20831ea48fb15fec0d5fce8.jpg', 'IMAGE'),
(5, 'https://i.pinimg.com/736x/1b/a5/42/1ba54211b20831ea48fb15fec0d5fce8.jpg', 'IMAGE'),
(6, 'https://i.pinimg.com/736x/1b/a5/42/1ba54211b20831ea48fb15fec0d5fce8.jpg', 'IMAGE'),
(7, 'https://i.pinimg.com/1200x/5a/fc/c3/5afcc3b74f9ae072bb2f7d45de3d7f5b.jpg', 'IMAGE'),
(8, 'https://i.pinimg.com/1200x/5a/fc/c3/5afcc3b74f9ae072bb2f7d45de3d7f5b.jpg', 'IMAGE'),
(9, 'https://i.pinimg.com/1200x/5a/fc/c3/5afcc3b74f9ae072bb2f7d45de3d7f5b.jpg', 'IMAGE'),
(10, 'https://i.pinimg.com/1200x/5a/fc/c3/5afcc3b74f9ae072bb2f7d45de3d7f5b.jpg', 'IMAGE');

-- =========================
-- DUYỆT SẢN PHẨM
-- =========================
INSERT INTO product_approvals (product_id, admin_id, action, reason)
SELECT id, 1, 'APPROVED', 'Kiểm duyệt nội dung hợp lệ.' FROM products;
