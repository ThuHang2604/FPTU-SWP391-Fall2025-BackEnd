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
 */
router.get("/", productController.getAllProduct);

/**
 * @swagger
 * /api/products/category/{cateId}:
 *   get:
 *     summary: Lấy sản phẩm theo Category ID (kèm media)
 *     tags: [Products]
 */
router.get("/category/:cateId", productController.getProductByCateId);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm theo tiêu đề
 *     tags: [Products]
 */
router.get("/search", productController.search);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Xem chi tiết sản phẩm (kèm media)
 *     tags: [Products]
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
 */
router.put("/:id/info", authMiddleware, productController.updateProductInfo);

/**
 * @swagger
 * /api/products/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái sản phẩm (MEMBER → SOLD/INACTIVE)
 *     description: Khi chuyển sang SOLD phải truyền thêm buyer_id để ghi nhận người mua.
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [SOLD, INACTIVE]
 *                 example: SOLD
 *               buyer_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái sản phẩm thành công
 *       400:
 *         description: Thiếu hoặc sai thông tin buyer_id
 *       403:
 *         description: Không có quyền cập nhật
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put("/:id/status", authMiddleware, productController.updateProductStatus);

/**
 * @swagger
 * /api/products/{id}/moderate:
 *   put:
 *     summary: Duyệt sản phẩm (ADMIN → APPROVED hoặc REJECTED)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id/moderate", authMiddleware, adminMiddleware, productController.updateModerateStatus);

module.exports = router;
