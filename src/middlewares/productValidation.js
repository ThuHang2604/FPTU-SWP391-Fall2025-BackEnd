const validateProductCreate = (req, res, next) => {
  const {
    category_id,
    title,
    price
  } = req.body;

  const errors = [];

  // Kiểm tra các trường bắt buộc
  if (!category_id) errors.push("category_id là bắt buộc");
  if (!title) errors.push("title là bắt buộc");
  if (!price) errors.push("price là bắt buộc");

  // Kiểm tra kiểu dữ liệu
  if (category_id && isNaN(category_id)) errors.push("category_id phải là số");
  if (title && typeof title !== 'string') errors.push("title phải là chuỗi");
  if (price && isNaN(price)) errors.push("price phải là số");

  // Kiểm tra các trường số khác nếu có
  if (req.body.year && isNaN(req.body.year)) errors.push("year phải là số");
  if (req.body.mileage && isNaN(req.body.mileage)) errors.push("mileage phải là số");
  if (req.body.cycle_count && isNaN(req.body.cycle_count)) errors.push("cycle_count phải là số");

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      errors: errors
    });
  }

  next();
};

const validateProductUpdate = (req, res, next) => {
  const errors = [];

  // Kiểm tra kiểu dữ liệu cho các trường có thể cập nhật
  if (req.body.category_id && isNaN(req.body.category_id)) errors.push("category_id phải là số");
  if (req.body.price && isNaN(req.body.price)) errors.push("price phải là số");
  if (req.body.year && isNaN(req.body.year)) errors.push("year phải là số");
  if (req.body.mileage && isNaN(req.body.mileage)) errors.push("mileage phải là số");
  if (req.body.cycle_count && isNaN(req.body.cycle_count)) errors.push("cycle_count phải là số");
  if (req.body.title && typeof req.body.title !== 'string') errors.push("title phải là chuỗi");

  if (errors.length > 0) {
    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateProductCreate,
  validateProductUpdate
};