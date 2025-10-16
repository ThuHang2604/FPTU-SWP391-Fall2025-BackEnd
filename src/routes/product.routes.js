const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API quản lý sản phẩm (bao gồm pin, xe máy điện, xe ô tô điện)
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách tất cả sản phẩm (kèm media)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
router.get("/", productController.getAllProduct);

/**
 * @swagger
 * /api/products/category/{cateId}:
 *   get:
 *     summary: Lấy sản phẩm theo Category ID (kèm media)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: cateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm theo danh mục
 */
router.get("/category/:cateId", productController.getProductByCateId);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm theo tiêu đề
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Chuỗi cần tìm trong tiêu đề sản phẩm
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm sản phẩm
 */
router.get("/search", productController.search);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Xem chi tiết sản phẩm (kèm media)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết sản phẩm
 */
router.get("/:id", productController.getProductDetail);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới (chỉ MEMBER)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category_id
 *               - title
 *               - price
 *               - product_type
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 1
 *               title:
 *                 type: string
 *                 example: "Xe máy điện VinFast Klara S"
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *                 example: 25000000
 *               location:
 *                 type: string
 *                 example: "Hà Nội"
 *               usage_duration:
 *                 type: string
 *                 example: "2 năm"
 *               warranty_info:
 *                 type: string
 *                 example: "Còn 6 tháng"
 *               condition_status:
 *                 type: string
 *                 example: "Đã sử dụng"
 *               origin:
 *                 type: string
 *                 example: "Việt Nam"
 *               product_type:
 *                 type: string
 *                 enum: [BATTERY, ELECTRIC_BIKE, ELECTRIC_CAR]
 *                 example: ELECTRIC_BIKE
 *               # Thông tin pin
 *               battery_type:
 *                 type: string
 *                 example: "Li-ion"
 *               battery_voltage:
 *                 type: string
 *                 example: "72V"
 *               battery_capacity:
 *                 type: string
 *                 example: "20Ah"
 *               battery_pack_config:
 *                 type: string
 *                 example: "10S6P"
 *               cycle_count:
 *                 type: integer
 *                 example: 120
 *               efficiency_remain:
 *                 type: string
 *                 example: "85%"
 *               repaired_or_modified:
 *                 type: boolean
 *               compatible_with:
 *                 type: string
 *                 example: "VinFast Feliz"
 *               # Thông tin ô tô điện
 *               brand:
 *                 type: string
 *                 example: "VinFast"
 *               model:
 *                 type: string
 *                 example: "VF e34"
 *               variant:
 *                 type: string
 *                 example: "Plus"
 *               year_of_manufacture:
 *                 type: integer
 *                 example: 2022
 *               transmission:
 *                 type: string
 *                 example: "Tự động"
 *               color:
 *                 type: string
 *                 example: "Trắng"
 *               body_type:
 *                 type: string
 *                 example: "SUV"
 *               seat_count:
 *                 type: integer
 *                 example: 5
 *               mileage:
 *                 type: integer
 *                 example: 8000
 *               license_plate:
 *                 type: string
 *                 example: "30H-12345"
 *               num_of_owners:
 *                 type: integer
 *                 example: 1
 *               accessories_included:
 *                 type: boolean
 *               registration_valid:
 *                 type: boolean
 *               # Thông tin xe máy/xe đạp điện
 *               bike_type:
 *                 type: string
 *                 enum: [ELECTRIC_MOTORBIKE, ELECTRIC_BICYCLE]
 *                 example: ELECTRIC_MOTORBIKE
 *               motor_power:
 *                 type: string
 *                 example: "1500W"
 *               top_speed:
 *                 type: string
 *                 example: "70 km/h"
 *               range_per_charge:
 *                 type: string
 *                 example: "80 km"
 *               charging_time:
 *                 type: string
 *                 example: "5 giờ"
 *               frame_type:
 *                 type: string
 *                 example: "Khung thép"
 *               brake_type:
 *                 type: string
 *                 example: "Phanh đĩa"
 *               tire_size:
 *                 type: string
 *                 example: "12 inch"
 *               has_battery_included:
 *                 type: boolean
 *               media:
 *                 type: array
 *                 description: Danh sách hình ảnh hoặc video sản phẩm
 *                 items:
 *                   type: object
 *                   properties:
 *                     media_url:
 *                       type: string
 *                     media_type:
 *                       type: string
 *                       enum: [IMAGE, VIDEO]
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công (bao gồm media)
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", authMiddleware, productController.createProduct);

/**
 * @swagger
 * /api/products/member:
 *   get:
 *     summary: Lấy danh sách sản phẩm của Member hiện tại
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm của thành viên đăng nhập
 */
router.get("/member", authMiddleware, productController.getProductByMemberId);

/**
 * @swagger
 * /api/products/{id}/info:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm (MEMBER)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               media:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     media_url:
 *                       type: string
 *                     media_type:
 *                       type: string
 *                       enum: [IMAGE, VIDEO]
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 */
router.put("/:id/info", authMiddleware, productController.updateProductInfo);

/**
 * @swagger
 * /api/products/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái (MEMBER => SOLD hoặc INACTIVE)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [SOLD, INACTIVE]
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái sản phẩm thành công
 */
router.put("/:id/status", authMiddleware, productController.updateProductStatus);

/**
 * @swagger
 * /api/products/{id}/moderate:
 *   put:
 *     summary: Duyệt sản phẩm (ADMIN => APPROVED hoặc REJECTED)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [APPROVED, REJECTED]
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sản phẩm đã được duyệt hoặc từ chối
 */
router.put("/:id/moderate", authMiddleware, adminMiddleware, productController.updateModerateStatus);

module.exports = router;
