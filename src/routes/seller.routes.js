const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/seller.controller");

/**
 * @swagger
 * tags:
 *   name: Sellers
 *   description: Quản lý và xem thông tin người bán
 */

/**
 * @swagger
 * /api/sellers/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết người bán và danh sách sản phẩm của họ
 *     description: Trả về thông tin cơ bản của người bán, trung bình đánh giá, cùng danh sách sản phẩm đã **APPROVED** hoặc **SOLD** kèm hình ảnh và các đánh giá chi tiết.
 *     tags: [Sellers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID của người bán (member_id)
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Thông tin người bán cùng sản phẩm của họ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 seller_id:
 *                   type: integer
 *                   example: 2
 *                 full_name:
 *                   type: string
 *                   example: "Nguyễn Văn A"
 *                 city:
 *                   type: string
 *                   example: "Hà Nội"
 *                 avatar:
 *                   type: string
 *                   example: "/uploads/avatars/2.jpg"
 *                 average_rating:
 *                   type: number
 *                   example: 4.6
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
 *                         example: 15
 *                       title:
 *                         type: string
 *                         example: "Xe máy điện VinFast Evo"
 *                       price:
 *                         type: number
 *                         example: 14500000
 *                       status:
 *                         type: string
 *                         enum: [APPROVED, SOLD]
 *                         example: "SOLD"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-10-28T10:02:00.000Z"
 *                       images:
 *                         type: array
 *                         description: Danh sách hình ảnh/video của sản phẩm
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 33
 *                             url:
 *                               type: string
 *                               example: "/uploads/products/15_1.jpg"
 *                             type:
 *                               type: string
 *                               enum: [IMAGE, VIDEO]
 *                               example: "IMAGE"
 *                       reviews:
 *                         type: array
 *                         description: Danh sách đánh giá của người mua
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 10
 *                             rating:
 *                               type: integer
 *                               minimum: 1
 *                               maximum: 5
 *                               example: 5
 *                             comment:
 *                               type: string
 *                               example: "Sản phẩm chất lượng, giao nhanh."
 *                             created_at:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-10-28T11:25:00.000Z"
 *                             reviewer:
 *                               type: object
 *                               properties:
 *                                 id:
 *                                   type: integer
 *                                   example: 7
 *                                 name:
 *                                   type: string
 *                                   example: "Trần Bình"
 *                                 avatar:
 *                                   type: string
 *                                   example: "/uploads/avatars/7.jpg"
 *       404:
 *         description: Không tìm thấy người bán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy người bán."
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi máy chủ."
 */
router.get("/:id", sellerController.getSellerProfile);

module.exports = router;
