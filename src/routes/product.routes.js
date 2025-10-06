const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { validateProductCreate, validateProductUpdate } = require("../middlewares/productValidation");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
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
 */
router.get("/", productController.getAllProduct);

/**
 * @swagger
 * /api/products/category/{cateId}:
 *   get:
 *     summary: Lấy sản phẩm theo category id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: cateId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm theo category
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
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm tìm được
 */
router.get("/search", productController.search);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin sản phẩm
 */
router.get("/:id", productController.getProductDetail);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Tạo sản phẩm mới (MEMBER)
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
 *             properties:
 *               category_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               usage_duration:
 *                 type: string
 *                 nullable: true
 *               warranty_info:
 *                 type: string
 *                 nullable: true
 *               location:
 *                 type: string
 *                 nullable: true
 *               brand:
 *                 type: string
 *                 nullable: true
 *               model:
 *                 type: string
 *                 nullable: true
 *               year:
 *                 type: integer
 *                 nullable: true
 *               mileage:
 *                 type: integer
 *                 nullable: true
 *               battery_type:
 *                 type: string
 *                 nullable: true
 *               capacity:
 *                 type: string
 *                 nullable: true
 *               cycle_count:
 *                 type: integer
 *                 nullable: true
 *               compatible_with:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/", authMiddleware, validateProductCreate, productController.createProduct);

/**
 * @swagger
 * /api/products/member:
 *   get:
 *     summary: Lấy danh sách sản phẩm của Member đang đăng nhập
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm
 */
router.get("/member", authMiddleware, productController.getProductByMemberId);

/**
 * @swagger
 * /api/products/{id}/info:
 *   put:
 *     summary: Cập nhật thông tin sản phẩm (MEMBER) → status tự động PENDING
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
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.put("/:id/info", authMiddleware, validateProductUpdate, productController.updateProductInfo);

/**
 * @swagger
 * /api/products/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái (MEMBER => SOLD/INACTIVE)
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
 *         description: Product status updated
 */
router.put("/:id/status", authMiddleware, productController.updateProductStatus);

/**
 * @swagger
 * /api/products/{id}/moderate:
 *   put:
 *     summary: Duyệt sản phẩm (ADMIN => APPROVED/REJECTED)
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
 *         description: Product moderate status updated
 */
router.put("/:id/moderate", authMiddleware, adminMiddleware, productController.updateModerateStatus);

module.exports = router;