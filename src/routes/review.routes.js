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
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Thành viên tạo đánh giá cho sản phẩm mà họ đã mua
 *     description: Chỉ người có buyer_id trùng với member_id mới được đánh giá.
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
 *                 example: 10
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Xe rất tốt, pin ổn định!"
 */
router.post("/", authMiddleware, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/product/{productId}:
 *   get:
 *     summary: Lấy tất cả đánh giá của một sản phẩm + điểm trung bình
 *     tags: [Reviews]
 */
router.get("/product/:productId", reviewController.getReviewsByProduct);

/**
 * @swagger
 * /api/reviews/seller/{sellerId}:
 *   get:
 *     summary: Lấy tất cả đánh giá dành cho người bán dựa trên sản phẩm họ đã bán
 *     tags: [Reviews]
 */
router.get("/seller/:sellerId", reviewController.getReviewsBySeller);

/**
 * @swagger
 * /api/reviews/user/{memberId}:
 *   get:
 *     summary: Lấy tất cả đánh giá mà người dùng đã viết
 *     tags: [Reviews]
 */
router.get("/user/:memberId", reviewController.getReviewsByMember);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Thành viên chỉnh sửa đánh giá của chính họ
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", authMiddleware, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Thành viên xóa đánh giá của chính họ
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;
