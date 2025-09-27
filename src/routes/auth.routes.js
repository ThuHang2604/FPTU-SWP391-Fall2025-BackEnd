const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth.controller");

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Thành công
 */
router.get("/users", userController.getAllUsers);

module.exports = router;
