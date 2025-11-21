USE ev_trading_platform;

-- =========================
-- 1. NGƯỜI DÙNG (USERS)
-- =========================
INSERT INTO users (full_name, email, password, phone, avatar, role, status)
VALUES 
('Admin System', 'admin@example.com', 
'$2b$10$OsESrJbKm4ra8F50yw8S2eezgP3ZqFJUy8Zmhuqe3VEYYkZ2jKi7S', 
'0900000001',
'https://i.pinimg.com/736x/b9/e0/e3/b9e0e30ac1ec95077b7e1d0abd250e5d.jpg',
'ADMIN', 'ACTIVE'),

('User Seller', 'seller@example.com', 
'$2b$10$OsESrJbKm4ra8F50yw8S2eezgP3ZqFJUy8Zmhuqe3VEYYkZ2jKi7S',
'0900000002',
'https://i.pinimg.com/736x/08/33/b9/0833b999afd16f9266d4af47d18a8ae5.jpg',
'MEMBER', 'ACTIVE'),

('Buyer Demo', 'buyer@example.com', 
'$2b$10$OsESrJbKm4ra8F50yw8S2eezgP3ZqFJUy8Zmhuqe3VEYYkZ2jKi7S',
'0900000003',
'https://i.pinimg.com/736x/ee/fb/72/eefb72b70b64a3de7e0cb1a9e73f7b7a.jpg',
'MEMBER', 'ACTIVE');

-- =========================
-- 2. THÀNH VIÊN & ADMIN
-- =========================
-- Lưu ý: Member ID 1 = Seller (User ID 2), Member ID 2 = Buyer (User ID 3)
INSERT INTO members (user_id, address, city, country, wallet_balance, status)
VALUES 
(2, '123 Nguyễn Trãi', 'Hà Nội', 'Vietnam', 500000.00, 'ACTIVE'),
(3, '456 Lê Lợi', 'TP.HCM', 'Vietnam', 200000.00, 'ACTIVE');

INSERT INTO admins (user_id) VALUES (1);

-- =========================
-- 3. DANH MỤC SẢN PHẨM
-- =========================
INSERT INTO categories (name, description) VALUES
('Pin', 'Các loại pin xe điện, pin lithium-ion, pin thay thế.'),
('Xe ô tô điện', 'Xe ô tô chạy bằng năng lượng điện, thân thiện môi trường.'),
('Xe máy / Xe đạp điện', 'Xe máy điện, xe đạp điện tiết kiệm năng lượng.');

-- =========================
-- 4. SẢN PHẨM MẪU (10 sản phẩm)
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
(1, 3, 'VinFast Klara S - xe máy điện cũ (ĐÃ BÁN)', 
'Xe chạy ổn, pin thuê, người bán và người mua giao dịch ngoài đời sau khi chat trên web.', 
21000000, 'Hà Nội',
'1 năm', 'Không bảo hành', 'Tốt', 'Việt Nam', 'ELECTRIC_BIKE',
'ELECTRIC_MOTORBIKE', '1500W', '70 km/h', '100 km', '5 tiếng', 
'Thép', 'Phanh đĩa', '14 inch', TRUE, 'SOLD'),
(1, 3, 'YADEA E3 - xe máy điện giá rẻ', 'Xe phù hợp học sinh, pin lithium mới thay.', 13500000, 'TP.HCM',
'6 tháng', 'Bảo hành 3 tháng', 'Tốt', 'Trung Quốc', 'ELECTRIC_BIKE',
'ELECTRIC_MOTORBIKE', '1000W', '50 km/h', '80 km', '4 tiếng', 
'Nhôm', 'Phanh tang trống', '12 inch', TRUE, 'APPROVED'),
(1, 3, 'JVC Eco - xe đạp điện tiết kiệm', 'Xe đạp điện nhẹ, phù hợp đi học.', 7500000, 'Đà Nẵng',
'1 năm', 'Không bảo hành', 'Khá', 'Việt Nam', 'ELECTRIC_BIKE',
'ELECTRIC_BICYCLE', '350W', '35 km/h', '60 km', '5 tiếng', 
'Thép', 'Phanh tang trống', '14 inch', TRUE, 'APPROVED'),
(1, 3, 'Pega Aura - xe máy điện sang trọng', 'Thiết kế thời trang, yên rộng.', 27000000, 'Huế',
'8 tháng', 'Bảo hành 6 tháng', 'Rất tốt', 'Việt Nam', 'ELECTRIC_BIKE',
'ELECTRIC_MOTORBIKE', '2000W', '75 km/h', '120 km', '6 tiếng', 
'Nhôm', 'Phanh đĩa', '14 inch', TRUE, 'APPROVED');

-- Cập nhật buyer_id cho sản phẩm 7 (đã bán)
UPDATE products SET buyer_id = 2 WHERE id = 7;

-- =========================
-- 5. HÌNH ẢNH SẢN PHẨM
-- =========================
INSERT INTO product_media (product_id, media_url, media_type)
SELECT id, 'https://i.pinimg.com/736x/cb/2f/f2/cb2ff25a0b87274fb7e69d831f32a14d.jpg', 'IMAGE' FROM products;

-- =========================
-- 6. DUYỆT SẢN PHẨM
-- =========================
INSERT INTO product_approvals (product_id, admin_id, action, reason)
SELECT id, 1, 'APPROVED', 'Kiểm duyệt nội dung hợp lệ.' FROM products;

-- =========================
-- 7. CHAT & REVIEW (ĐÃ SỬA LẠI CHO KHỚP SCHEMA MỚI)
-- =========================

-- A. Tạo Chatbox trước
INSERT INTO chatboxes (product_id, seller_id, buyer_id)
VALUES (7, 1, 2);

-- B. Lấy ID của Chatbox vừa tạo
SET @chatbox_id = LAST_INSERT_ID();

-- C. Tạo tin nhắn sử dụng @chatbox_id
-- Bảng "chat_messages" thay vì "messages", dùng cột "chatbox_id"
INSERT INTO chat_messages (chatbox_id, sender_id, message)
VALUES
(@chatbox_id, 2, 'Chào anh, xe Klara còn không ạ?'),
(@chatbox_id, 1, 'Xe còn nhé, bạn muốn qua xem xe không?'),
(@chatbox_id, 2, 'Dạ mai em qua xem nhé.'),
(@chatbox_id, 1, 'Ok em, mai gặp nha.');

-- D. Review sau giao dịch
INSERT INTO reviews (member_id, product_id, rating, comment)
VALUES
(2, 7, 5, 'Xe chạy tốt, đúng mô tả, người bán thân thiện và hỗ trợ tận tình!');

-- =========================
-- 8. PAYMENT
-- =========================
INSERT INTO payments (member_id, amount, payment_status)
VALUES (1, 10000, 'COMPLETED');

INSERT INTO payment_history (payment_id, status, note)
VALUES (LAST_INSERT_ID(), 'SUCCESS', 'Thanh toán hoàn tất khi đăng tin sản phẩm');

-- =========================
-- 9. CẬP NHẬT DỮ LIỆU (LÀM ĐẸP)
-- =========================
-- Chỉnh địa chỉ chi tiết
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

-- Chỉnh sửa hình ảnh
UPDATE product_media pm
JOIN products p ON pm.product_id = p.id
SET pm.media_url = 'https://i.pinimg.com/736x/9b/be/00/9bbe005374cb1b4010c5dbff7b31a511.jpg'
WHERE p.product_type = 'ELECTRIC_BIKE' AND p.bike_type = 'ELECTRIC_MOTORBIKE';

UPDATE product_media pm
JOIN products p ON pm.product_id = p.id
SET pm.media_url = 'https://i.pinimg.com/1200x/46/98/27/4698273614cb5ea8668f7c63a0411129.jpg'
WHERE p.product_type = 'ELECTRIC_BIKE' AND p.bike_type = 'ELECTRIC_BICYCLE';

UPDATE product_media pm
JOIN products p ON pm.product_id = p.id
SET pm.media_url = 'https://i.pinimg.com/736x/b1/c5/77/b1c577cee64d437d5b578d9b69d9f82a.jpg'
WHERE p.product_type = 'ELECTRIC_CAR';

-- =========================
-- DONE
-- =========================
SELECT '✅ SampleDB Initialized Successfully with Corrected Schema!' AS message;