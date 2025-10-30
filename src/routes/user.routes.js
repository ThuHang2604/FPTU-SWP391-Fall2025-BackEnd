const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng (chỉ ADMIN)
 */

/**
 * @swagger
 * /api/users/search-buyer:
 *   get:
 *     summary: Tìm kiếm người mua theo email hoặc số điện thoại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Email hoặc số điện thoại của người mua cần tìm
 *     responses:
 *       200:
 *         description: Thông tin người mua hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SearchBuyerResponse'
 *       400:
 *         description: Thiếu tham số query
 *       404:
 *         description: Không tìm thấy người mua hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.get("/search-buyer", authMiddleware, userController.searchBuyer);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách người dùng được lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Lỗi server
 */
router.get("/", authMiddleware, adminMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng cần xem
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", authMiddleware, adminMiddleware, userController.getUserById);

/**
 * @swagger
 * /api/users/{id}/approve:
 *   patch:
 *     summary: Phê duyệt (kích hoạt) người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng cần phê duyệt
 *     responses:
 *       200:
 *         description: Phê duyệt thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Người dùng đã được kích hoạt
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id/approve", authMiddleware, adminMiddleware, userController.approveUser);

/**
 * @swagger
 * /api/users/{id}/block:
 *   patch:
 *     summary: Khóa (vô hiệu hóa) tài khoản người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng cần khóa
 *     responses:
 *       200:
 *         description: Người dùng đã bị khóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Người dùng đã bị khóa trước đó
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.patch("/:id/block", authMiddleware, adminMiddleware, userController.blockUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng khỏi hệ thống
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Không tìm thấy người dùng
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", authMiddleware, adminMiddleware, userController.deleteUser);

/**
 * @swagger
 * /api/users/admin:
 *   post:
 *     summary: Tạo tài khoản quản trị viên mới
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAdminRequest'
 *     responses:
 *       201:
 *         description: Tạo tài khoản quản trị viên thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc email/số điện thoại đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.post("/admin", authMiddleware, adminMiddleware, userController.createAdmin);

module.exports = router;
