const express = require("express");
const router = express.Router();
const approvalController = require("../controllers/productApproval.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/**
 * @swagger
 * tags:
 *   name: ProductApprovals
 *   description: Product approval history APIs (Admin only)
 */

/**
 * @swagger
 * /api/product-approvals:
 *   get:
 *     summary: Lấy tất cả approval (ADMIN)
 *     tags: [ProductApprovals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách approval
 */
router.get("/", authMiddleware, adminMiddleware, approvalController.getAllApproval);

/**
 * @swagger
 * /api/product-approvals/admin/{adminId}:
 *   get:
 *     summary: Lấy danh sách approval theo admin id (ADMIN)
 *     tags: [ProductApprovals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách approval theo admin
 */
router.get("/admin/:adminId", authMiddleware, adminMiddleware, approvalController.getApprovalByAdminId);

/**
 * @swagger
 * /api/product-approvals/product/{productId}:
 *   get:
 *     summary: Lấy danh sách approval theo product id (ADMIN) Trả về lịch sử phê duyệt của sản phẩm
 *     tags: [ProductApprovals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Danh sách approval theo product
 */
router.get("/product/:productId", authMiddleware, adminMiddleware, approvalController.getApprovalByProductId);

module.exports = router;
