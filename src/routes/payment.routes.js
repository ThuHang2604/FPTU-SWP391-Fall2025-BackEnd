// routes/payment.routes.js
const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: APIs xử lý thanh toán PayPal, nạp ví, thanh toán phí đăng tin & hoàn tiền
 */

/* -----------------------------------------------------
   1) Tạo thanh toán PayPal (Nạp ví hoặc trả phí đăng tin)
----------------------------------------------------- */
/**
 * @swagger
 * /api/payments/create:
 *   post:
 *     summary: Tạo đơn thanh toán PayPal
 *     description: Gửi packageId để nạp ví hoặc productId để thanh toán phí đăng tin.
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
 *               productId:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Tạo link thanh toán thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi PayPal hoặc server
 */
router.post("/create", authMiddleware, paymentController.createPayment);

/* -----------------------------------------------------
   2) PayPal callback – Thanh toán thành công
----------------------------------------------------- */
/**
 * @swagger
 * /api/payments/success:
 *   get:
 *     summary: PayPal redirect khi thanh toán thành công
 *     tags: [Payments]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect về frontend
 */
router.get("/success", paymentController.successPayment);

/* -----------------------------------------------------
   3) PayPal callback – Hủy thanh toán
----------------------------------------------------- */
/**
 * @swagger
 * /api/payments/cancel:
 *   get:
 *     summary: PayPal redirect khi người dùng nhấn Cancel
 *     tags: [Payments]
 *     responses:
 *       302:
 *         description: Redirect về trang hủy
 */
router.get("/cancel", paymentController.cancelPayment);

/* -----------------------------------------------------
   4) Lịch sử giao dịch của Member
----------------------------------------------------- */
/**
 * @swagger
 * /api/payments/history:
 *   get:
 *     summary: Lấy lịch sử giao dịch của người dùng
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lịch sử giao dịch
 */
router.get("/history", authMiddleware, paymentController.getPaymentHistory);

/* -----------------------------------------------------
   5) Yêu cầu hoàn tiền nếu sản phẩm bị Admin từ chối
----------------------------------------------------- */
/**
 * @swagger
 * /api/payments/refund-rejected:
 *   post:
 *     summary: Yêu cầu hoàn tiền cho sản phẩm bị từ chối duyệt
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: integer
 *                 example: 123
 *     responses:
 *       200:
 *         description: Hoàn tiền thành công
 *       400:
 *         description: Không hợp lệ
 *       404:
 *         description: Không tìm thấy Product
 */
router.post(
  "/refund-rejected",
  authMiddleware,
  paymentController.requestRefundForRejectedProduct
);

/* -----------------------------------------------------
   6) Admin – Lấy toàn bộ giao dịch
----------------------------------------------------- */
/**
 * @swagger
 * /api/payments/admin/all:
 *   get:
 *     summary: Lấy toàn bộ giao dịch hệ thống (Admin)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách giao dịch
 *       403:
 *         description: Không có quyền Admin
 */
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  paymentController.getAllPaymentsForAdmin
);

module.exports = router;
