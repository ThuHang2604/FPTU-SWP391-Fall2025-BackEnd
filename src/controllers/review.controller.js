const { Op } = require("sequelize");
const db = require("../models");

const Review = db.Review;
const Product = db.Product;
const Payment = db.Payment;
const Member = db.Member;

/**
 * @desc   Tạo đánh giá mới (chỉ khi người dùng đã mua sản phẩm)
 * @route  POST /api/reviews
 */
exports.createReview = async (req, res) => {
  try {
    const member_id = req.user.member_id || req.body.member_id;
    const { product_id, rating, comment } = req.body;

    // Kiểm tra giao dịch đã hoàn tất (đảm bảo người dùng đã mua hàng)
    const hasPurchased = await Payment.findOne({
      where: {
        member_id,
        product_id,
        payment_status: { [Op.eq]: "COMPLETED" },
      },
    });

    if (!hasPurchased) {
      return res.status(400).json({
        message: "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua thành công.",
      });
    }

    // Tạo review mới
    const review = await Review.create({
      member_id,
      product_id,
      rating,
      comment,
    });

    return res.status(201).json({
      message: "Đánh giá đã được tạo thành công.",
      review,
    });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đánh giá:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * @desc   Lấy tất cả đánh giá của 1 sản phẩm
 * @route  GET /api/reviews/product/:productId
 */
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.findAll({
      where: { product_id: productId },
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "user_id", "status"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["full_name", "avatar"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đánh giá theo sản phẩm:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * @desc   Lấy tất cả đánh giá của người dùng (người mua)
 * @route  GET /api/reviews/member/:memberId
 */
exports.getReviewsByMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const reviews = await Review.findAll({
      where: { member_id: memberId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "title", "price", "product_type"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đánh giá theo người dùng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * @desc   Lấy tất cả đánh giá của người bán (dựa trên sản phẩm họ đăng)
 * @route  GET /api/reviews/seller/:sellerId
 */
exports.getReviewsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    const products = await Product.findAll({
      where: { member_id: sellerId },
      attributes: ["id", "title"],
      include: [
        {
          model: Review,
          as: "reviews",
          include: [
            {
              model: Member,
              as: "member",
              attributes: ["id", "user_id"],
              include: [
                {
                  model: db.User,
                  as: "user",
                  attributes: ["full_name", "avatar"],
                },
              ],
            },
          ],
        },
      ],
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error("❌ Lỗi khi lấy đánh giá của người bán:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * @desc   Cập nhật đánh giá
 * @route  PUT /api/reviews/:id
 */
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá." });

    await review.update({ rating, comment });

    return res.status(200).json({
      message: "Đánh giá đã được cập nhật.",
      review,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật đánh giá:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};

/**
 * @desc   Xóa đánh giá
 * @route  DELETE /api/reviews/:id
 */
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá." });

    await review.destroy();

    return res.status(200).json({ message: "Đánh giá đã được xóa thành công." });
  } catch (error) {
    console.error("❌ Lỗi khi xóa đánh giá:", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ", error });
  }
};
