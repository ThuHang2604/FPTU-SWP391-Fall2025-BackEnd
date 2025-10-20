const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API Thanh toán & Giao dịch
 */

/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Tạo đơn thanh toán PayPal
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               packageId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: URL phê duyệt thanh toán PayPal
 *       400:
 *         description: Gói không hợp lệ
 */
router.post("/create", authMiddleware, paymentController.createPayment);

/**
 * @swagger
 * /api/payments/success:
 *   get:
 *     summary: Xử lý khi thanh toán PayPal thành công
 *     tags: [Payments]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang thành công
 */
router.get("/success", paymentController.successPayment);

/**
 * @swagger
 * /api/payments/cancel:
 *   get:
 *     summary: Hủy thanh toán PayPal
 *     tags: [Payments]
 *     responses:
 *       302:
 *         description: Chuyển hướng đến trang hủy giao dịch
 */
router.get("/cancel", paymentController.cancelPayment);

/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Lấy lịch sử thanh toán của người dùng
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lịch sử thanh toán
 */
router.get("/history", authMiddleware, paymentController.getPaymentHistory);

module.exports = router;
