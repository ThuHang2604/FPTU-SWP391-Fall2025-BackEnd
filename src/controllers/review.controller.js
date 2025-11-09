const db = require("../models");
const Review = db.Review;
const Product = db.Product;
const User = db.User;
const Member = db.Member;

// 🧾 Thành viên tạo đánh giá sản phẩm
exports.createReview = async (req, res) => {
  try {
    const member_id = req.user.memberId;
    const { product_id, rating, comment } = req.body;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    // Kiểm tra quyền review — chỉ người mua mới được phép
    if (product.buyer_id !== member_id) {
      return res.status(403).json({ message: "Bạn chưa mua sản phẩm này nên không thể đánh giá." });
    }

    // Kiểm tra đã review chưa
    const existing = await Review.findOne({
      where: { member_id, product_id },
    });
    if (existing) {
      return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi." });
    }

    // Tạo review
    const review = await Review.create({
      member_id,
      product_id,
      rating,
      comment,
    });

    return res.status(201).json({ message: "Tạo đánh giá thành công.", review });
  } catch (error) {
    console.error("❌ Lỗi createReview:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// 📦 Lấy tất cả đánh giá của 1 sản phẩm + trung bình
exports.getReviewsByProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    const reviews = await Review.findAll({
      where: { product_id },
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "user_id"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["full_name", "avatar"], // thêm avatar nếu cần
            },
          ],
        },
      ],
    });

    const avgRating = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : 0;

    res.json({ average_rating: avgRating, reviews });
  } catch (error) {
    console.error("❌ Lỗi getReviewsByProduct:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// 🧍 Lấy đánh giá mà người dùng đã viết
exports.getReviewsByMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    const reviews = await Review.findAll({
      where: { member_id: memberId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "title"],
        },
        {
          model: Member,
          as: "member",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["full_name", "avatar"], // ✅ Lấy tên & avatar
            },
          ],
        },
      ],
    });

    const formatted = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      product: {
        id: r.product?.id,
        title: r.product?.title,
      },
      reviewer: {
        id: r.member_id,
        full_name: r.member?.user?.full_name || "Ẩn danh",
        avatar: r.member?.user?.avatar || null,
      },
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Lỗi getReviewsByMember:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};


// 🏪 Lấy tất cả đánh giá của người bán (qua các sản phẩm họ bán)
exports.getReviewsBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const reviews = await Review.findAll({
      include: [
        {
          model: Product,
          as: "product",
          where: { member_id: sellerId },
          attributes: ["id", "title"],
        },
        {
          model: Member,
          as: "member",
          attributes: ["id", "user_id"],
        },
      ],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// ✏️ Cập nhật review
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const member_id = req.user.memberId;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá." });
    if (review.member_id !== member_id)
      return res.status(403).json({ message: "Không có quyền chỉnh sửa đánh giá này." });

    await review.update({ rating, comment });
    res.json({ message: "Cập nhật đánh giá thành công.", review });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// ❌ Xóa review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const member_id = req.user.memberId;

    const review = await Review.findByPk(id);
    if (!review) return res.status(404).json({ message: "Không tìm thấy đánh giá." });
    if (review.member_id !== member_id)
      return res.status(403).json({ message: "Không có quyền xóa đánh giá này." });

    await review.destroy();
    res.json({ message: "Đã xóa đánh giá thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
