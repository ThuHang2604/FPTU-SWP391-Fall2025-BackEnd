const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notification.controller");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Quản lý thông báo người dùng
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         member_id:
 *           type: integer
 *           example: 10
 *         message:
 *           type: string
 *           example: "Sản phẩm của bạn đã được phê duyệt."
 *         is_read:
 *           type: boolean
 *           example: false
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-10-21T14:32:00.000Z"
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Tạo thông báo mới
 *     tags: [Notifications]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - member_id
 *               - message
 *             properties:
 *               member_id:
 *                 type: integer
 *                 example: 10
 *               message:
 *                 type: string
 *                 example: "Sản phẩm của bạn đã được duyệt."
 *     responses:
 *       201:
 *         description: Tạo thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 */
router.post("/", notificationController.createNotification);

/**
 * @swagger
 * /api/notifications/member/{member_id}:
 *   get:
 *     summary: Lấy danh sách thông báo của thành viên
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thành viên
 *     responses:
 *       200:
 *         description: Danh sách thông báo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 */
router.get("/member/:member_id", notificationController.getNotificationsByMember);

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     summary: Lấy chi tiết thông báo theo ID
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Thông tin chi tiết thông báo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Không tìm thấy thông báo
 */
router.get("/:id", notificationController.getNotificationById);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   patch:
 *     summary: Đánh dấu một thông báo là đã đọc
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thông báo
 *     responses:
 *       200:
 *         description: Đã đánh dấu là đã đọc
 *       404:
 *         description: Không tìm thấy thông báo
 */
router.patch("/:id/read", notificationController.markAsRead);

/**
 * @swagger
 * /api/notifications/member/{member_id}/read-all:
 *   patch:
 *     summary: Đánh dấu tất cả thông báo của thành viên là đã đọc
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: member_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thành viên
 *     responses:
 *       200:
 *         description: Tất cả thông báo đã được đánh dấu là đã đọc
 */
router.patch("/member/:member_id/read-all", notificationController.markAllAsRead);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Xóa một thông báo
 *     tags: [Notifications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thông báo cần xóa
 *     responses:
 *       200:
 *         description: Xóa thông báo thành công
 *       404:
 *         description: Không tìm thấy thông báo
 */
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
