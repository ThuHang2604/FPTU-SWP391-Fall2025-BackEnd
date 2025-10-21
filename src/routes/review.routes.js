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
 *           example: 12
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 4
 *         comment:
 *           type: string
 *           example: "Sản phẩm rất tốt, giao nhanh!"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-21T10:15:00Z"
 */

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");

// ========================== ROUTES ==========================

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Người dùng đánh giá sản phẩm đã mua
 *     tags: [Reviews]
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
 *                 example: 12
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm tuyệt vời, pin bền!"
 *     responses:
 *       201:
 *         description: Đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       403:
 *         description: Người dùng chưa mua sản phẩm này
 */
router.post("/", reviewController.createReview);

/**
 * @swagger
 * /reviews/product/{product_id}:
 *   get:
 *     summary: Lấy tất cả đánh giá của một sản phẩm
 *     tags: [Reviews]
 *     parameters:
 *       - name: product_id
 *         in: path
 *         required: true
 *         description: ID sản phẩm cần xem đánh giá
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách đánh giá và điểm trung bình
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product_id:
 *                   type: integer
 *                   example: 12
 *                 average_rating:
 *                   type: number
 *                   example: 4.3
 *                 total_reviews:
 *                   type: integer
 *                   example: 8
 *                 reviews:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 */
router.get("/product/:product_id", reviewController.getReviewsByProduct);

/**
 * @swagger
 * /reviews/seller/{seller_id}:
 *   get:
 *     summary: Tổng hợp đánh giá của người bán (qua sản phẩm họ đã bán)
 *     tags: [Reviews]
 *     parameters:
 *       - name: seller_id
 *         in: path
 *         required: true
 *         description: ID của người bán
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm kèm đánh giá và điểm trung bình của người bán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller_id:
 *                   type: integer
 *                   example: 3
 *                 seller_average_rating:
 *                   type: number
 *                   example: 4.5
 *                 total_reviews:
 *                   type: integer
 *                   example: 12
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       name:
 *                         type: string
 *                         example: "VinFast VF5"
 *                       reviews:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Review'
 */
router.get("/seller/:seller_id", reviewController.getReviewsBySeller);

/**
 * @swagger
 * /reviews/user/{member_id}:
 *   get:
 *     summary: Lấy danh sách đánh giá mà người dùng đã viết
 *     tags: [Reviews]
 *     parameters:
 *       - name: member_id
 *         in: path
 *         required: true
 *         description: ID của người dùng (member)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách đánh giá của người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/user/:member_id", reviewController.getUserReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Chỉnh sửa đánh giá
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của đánh giá cần chỉnh sửa
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
 *                 example: "Sau vài ngày sử dụng thấy ổn định hơn!"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       403:
 *         description: Không có quyền chỉnh sửa
 */
router.put("/:id", reviewController.updateReview);

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Xóa đánh giá của người dùng
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID của đánh giá cần xóa
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       403:
 *         description: Không có quyền xóa
 */
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
