const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý sản phẩm, đăng bán, cập nhật & duyệt bài
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductMedia:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         product_id:
 *           type: integer
 *           example: 3
 *         media_url:
 *           type: string
 *           example: "https://example.com/image.jpg"
 *         media_type:
 *           type: string
 *           example: "IMAGE"
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         member_id:
 *           type: integer
 *           example: 4
 *         category_id:
 *           type: integer
 *           example: 2
 *         title:
 *           type: string
 *           example: "Xe máy điện VinFast Klara S"
 *         description:
 *           type: string
 *           example: "Xe điện còn mới 95%, pin tốt, sạc nhanh."
 *         price:
 *           type: number
 *           example: 12000000
 *         location:
 *           type: string
 *           example: "Hà Nội"
 *         status:
 *           type: string
 *           example: "APPROVED"
 *         product_type:
 *           type: string
 *           example: "ELECTRIC_BIKE"
 *         buyer_id:
 *           type: integer
 *           example: 9
 *         media:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductMedia'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy tất cả sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get("/", productController.getAllProduct);

/**
 * @swagger
 * /api/products/category/{cateId}:
 *   get:
 *     summary: Lấy sản phẩm theo category ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: cateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm thuộc danh mục
 */
router.get("/category/:cateId", productController.getProductByCateId);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Tìm kiếm sản phẩm theo tên
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Tên sản phẩm cần tìm
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 */
router.get("/search", productController.search);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Chi tiết sản phẩm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/:id", productController.getProductDetail);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Thành viên tạo sản phẩm mới
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: integer
 *                 example: 2
 *               title:
 *                 type: string
 *                 example: "Pin Lithium 48V - 20Ah"
 *               description:
 *                 type: string
 *                 example: "Pin chính hãng, còn mới 90%"
 *               price:
 *                 type: number
 *                 example: 3500000
 *               location:
 *                 type: string
 *                 example: "TP. Hồ Chí Minh"
 *               product_type:
 *                 type: string
 *                 example: "BATTERY"
 *               media:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ProductMedia'
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post("/", authMiddleware, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm (Member)
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
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền cập nhật
 */
router.put("/:id", authMiddleware, productController.updateProductInfo);

/**
 * @swagger
 * /api/products/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái sản phẩm (SOLD / INACTIVE)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID sản phẩm
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
 *                 example: "SOLD"
 *               buyer_id:
 *                 type: integer
 *                 example: 7
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put("/:id/status", authMiddleware, productController.updateProductStatus);

/**
 * @swagger
 * /api/products/{id}/moderate:
 *   put:
 *     summary: Admin duyệt bài đăng (APPROVED / REJECTED)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm cần duyệt
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
 *                 example: "APPROVED"
 *               reason:
 *                 type: string
 *                 example: "Ảnh mờ, cần chụp rõ hơn"
 *     responses:
 *       200:
 *         description: Duyệt sản phẩm thành công
 *       403:
 *         description: Không phải admin
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.put("/:id/moderate", authMiddleware, productController.updateModerateStatus);

/**
 * @swagger
 * /api/products/my:
 *   get:
 *     summary: Lấy danh sách sản phẩm của thành viên hiện tại
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm của member
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get("/my", authMiddleware, productController.getProductByMemberId);

module.exports = router;
