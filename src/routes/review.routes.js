const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: APIs quản lý đánh giá & phản hồi sau bán hàng
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
 *           example: 3
 *         product_id:
 *           type: integer
 *           example: 12
 *         rating:
 *           type: number
 *           format: float
 *           example: 4.5
 *         comment:
 *           type: string
 *           example: "Sản phẩm hoạt động tốt, pin bền."
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-27T10:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-10-27T10:10:00Z"
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Thành viên tạo đánh giá cho sản phẩm đã mua
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
 *                 example: 12
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm tuyệt vời, pin dùng lâu."
 *     responses:
 *       201:
 *         description: Tạo đánh giá thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo đánh giá thành công."
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Đã đánh giá hoặc request không hợp lệ
 *       403:
 *         description: Không có quyền đánh giá sản phẩm này
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.post("/", authMiddleware, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/product/{product_id}:
 *   get:
 *     summary: Lấy tất cả đánh giá của 1 sản phẩm + trung bình rating
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
 *         description: Danh sách đánh giá của sản phẩm (bao gồm tên & avatar của người viết)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 average_rating:
 *                   type: number
 *                   example: 4.7
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       rating:
 *                         type: number
 *                         example: 5
 *                       comment:
 *                         type: string
 *                         example: "Sản phẩm rất tốt, pin dùng lâu."
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-30T12:00:00Z"
 *                       member:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 3
 *                           user:
 *                             type: object
 *                             properties:
 *                               full_name:
 *                                 type: string
 *                                 example: "Nguyễn Văn A"
 *                               avatar:
 *                                 type: string
 *                                 example: "https://example.com/avatar.jpg"
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get("/product/:product_id", reviewController.getReviewsByProduct);

/**
 * @swagger
 * /api/reviews/member/{memberId}:
 *   get:
 *     summary: Lấy tất cả đánh giá mà thành viên đã viết
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: memberId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thành viên
 *     responses:
 *       200:
 *         description: Danh sách review của thành viên
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/member/:memberId", reviewController.getReviewsByMember);

/**
 * @swagger
 * /api/reviews/seller/{sellerId}:
 *   get:
 *     summary: Lấy tất cả đánh giá của người bán (qua các sản phẩm họ bán)
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người bán
 *     responses:
 *       200:
 *         description: Danh sách đánh giá sản phẩm của người bán
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 */
router.get("/seller/:sellerId", reviewController.getReviewsBySeller);

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Cập nhật đánh giá (chỉ người tạo mới được chỉnh sửa)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của review cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Sau 1 tuần dùng, pin giảm nhẹ."
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật đánh giá thành công."
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       403:
 *         description: Không có quyền chỉnh sửa
 *       404:
 *         description: Không tìm thấy review
 */
router.put("/:id", authMiddleware, reviewController.updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Xóa đánh giá (chỉ người tạo được phép)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của review cần xóa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã xóa đánh giá thành công."
 *       403:
 *         description: Không có quyền xóa
 *       404:
 *         description: Không tìm thấy review
 */
router.delete("/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;
