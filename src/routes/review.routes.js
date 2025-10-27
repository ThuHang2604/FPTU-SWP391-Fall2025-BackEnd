// src/routes/review.routes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Quản lý đánh giá & phản hồi sau bán hàng
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         member_id:
 *           type: integer
 *           example: 5
 *         product_id:
 *           type: integer
 *           example: 3
 *         rating:
 *           type: integer
 *           example: 5
 *         comment:
 *           type: string
 *           example: "Sản phẩm tuyệt vời, pin bền!"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Thành viên tạo đánh giá sản phẩm đã mua
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - rating
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm tuyệt vời, pin bền!"
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 *       400:
 *         description: Người dùng đã đánh giá sản phẩm này
 *       403:
 *         description: Người dùng chưa mua sản phẩm hoặc giao dịch chưa hoàn tất
 */
router.post("/", authMiddleware, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/product/{product_id}:
 *   get:
 *     summary: Lấy tất cả đánh giá của 1 sản phẩm + trung bình đánh giá
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Danh sách đánh giá của sản phẩm
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/product/:product_id", reviewController.getReviewsByProduct);

/**
 * @swagger
 * /api/reviews/seller/{seller_id}:
 *   get:
 *     summary: Lấy tất cả đánh giá của người bán dựa trên các sản phẩm họ đã bán
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: seller_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người bán
 *     responses:
 *       200:
 *         description: Danh sách đánh giá cho người bán
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/seller/:seller_id", reviewController.getReviewsBySeller);

/**
 * @swagger
 * /api/reviews/user/{member_id}:
 *   get:
 *     summary: Lấy tất cả đánh giá mà người dùng đã viết
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thành viên
 *     responses:
 *       200:
 *         description: Danh sách đánh giá của người dùng
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/user/:member_id", reviewController.getUserReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Thành viên chỉnh sửa đánh giá của mình
 *     tags: [Reviews]
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
 *               rating:
 *                 type: integer
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Sau 1 tuần dùng vẫn rất ổn!"
 *     responses:
 *       200:
 *         description: Cập nhật đánh giá thành công
 *       403:
 *         description: Không có quyền sửa đánh giá này
 *       404:
 *         description: Không tìm thấy đánh giá
 */
router.put("/:id", authMiddleware, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Thành viên xóa đánh giá của mình
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa đánh giá thành công
 *       403:
 *         description: Không có quyền xóa đánh giá này
 *       404:
 *         description: Không tìm thấy đánh giá
 */
router.delete("/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;
