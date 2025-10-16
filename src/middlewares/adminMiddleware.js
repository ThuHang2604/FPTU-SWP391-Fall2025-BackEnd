/**
 * Middleware kiểm tra quyền ADMIN
 * Dùng sau authMiddleware
 */
module.exports = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Không có thông tin người dùng trong token." });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Truy cập bị từ chối. Chỉ ADMIN được phép thực hiện hành động này." });
    }

    next();
  } catch (error) {
    console.error("adminMiddleware error:", error);
    res.status(500).json({ message: "Lỗi máy chủ nội bộ khi xác thực quyền ADMIN.", error });
  }
};
