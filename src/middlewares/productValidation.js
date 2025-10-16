/**
 * Middleware xác thực dữ liệu sản phẩm khi tạo hoặc cập nhật
 */
exports.validateProductCreate = (req, res, next) => {
  const {
    category_id,
    title,
    price,
    product_type,
    bike_type,
    media,
  } = req.body;

  // --------- Kiểm tra các trường bắt buộc ---------
  if (!category_id || !title || !price || !product_type) {
    return res.status(400).json({
      message: "Thiếu dữ liệu bắt buộc: category_id, title, price, hoặc product_type.",
    });
  }

  // --------- Kiểm tra enum product_type ---------
  const validTypes = ["BATTERY", "ELECTRIC_BIKE", "ELECTRIC_CAR"];
  if (!validTypes.includes(product_type)) {
    return res.status(400).json({
      message: `Giá trị product_type không hợp lệ. Phải là một trong: ${validTypes.join(", ")}.`,
    });
  }

  // --------- Kiểm tra logic theo loại sản phẩm ---------
  if (product_type === "BATTERY") {
    const requiredBattery = ["battery_type", "battery_voltage", "battery_capacity"];
    const missing = requiredBattery.filter((f) => !req.body[f]);
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Thiếu thông tin bắt buộc cho pin: ${missing.join(", ")}.`,
      });
    }
  }

  if (product_type === "ELECTRIC_BIKE" && bike_type) {
    const validBikeType = ["ELECTRIC_MOTORBIKE", "ELECTRIC_BICYCLE"];
    if (!validBikeType.includes(bike_type)) {
      return res.status(400).json({
        message: `Giá trị bike_type không hợp lệ. Phải là một trong: ${validBikeType.join(", ")}.`,
      });
    }
  }

  // --------- Kiểm tra media (nếu có) ---------
  if (media && !Array.isArray(media)) {
    return res.status(400).json({ message: "Trường media phải là một mảng (array)." });
  }

  next();
};

/**
 * Middleware xác thực khi cập nhật sản phẩm
 */
exports.validateProductUpdate = (req, res, next) => {
  const { price, status, product_type, bike_type } = req.body;

  // --------- Kiểm tra giá ---------
  if (price !== undefined && (isNaN(price) || price < 0)) {
    return res.status(400).json({ message: "Giá sản phẩm không hợp lệ." });
  }

  // --------- Kiểm tra status hợp lệ ---------
  const validStatus = ["PENDING", "APPROVED", "REJECTED", "SOLD", "INACTIVE"];
  if (status && !validStatus.includes(status)) {
    return res.status(400).json({
      message: `Trạng thái không hợp lệ. Phải là một trong: ${validStatus.join(", ")}.`,
    });
  }

  // --------- Kiểm tra loại sản phẩm nếu có ---------
  const validProductType = ["BATTERY", "ELECTRIC_BIKE", "ELECTRIC_CAR"];
  if (product_type && !validProductType.includes(product_type)) {
    return res.status(400).json({
      message: `Loại sản phẩm không hợp lệ. Phải là: ${validProductType.join(", ")}.`,
    });
  }

  if (bike_type) {
    const validBikeType = ["ELECTRIC_MOTORBIKE", "ELECTRIC_BICYCLE"];
    if (!validBikeType.includes(bike_type)) {
      return res.status(400).json({
        message: `Loại xe hai bánh không hợp lệ. Phải là: ${validBikeType.join(", ")}.`,
      });
    }
  }

  next();
};
