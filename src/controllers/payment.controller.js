// controllers/payment.controller.js
const paypal = require("@paypal/checkout-server-sdk");
const paypalClient = require("../config/paypal");
const { sequelize, Payment, PaymentHistory, Member, Product, User } = require("../models");

// ⚙️ [POST] /api/payments/create
exports.createPayment = async (req, res) => {
  try {
    // packageId dành cho nạp ví, productId dành cho thanh toán phí đăng tin trực tiếp
    const { packageId, productId } = req.body; 
    const memberId = req.user.memberId;

    let amountUSD = 0;
    let description = "";

    // LOGIC 1: Nạp ví theo gói (nếu có packageId)
    if (packageId) {
      const packages = [
        { id: 1, name: "Gói 100K", usd: 4 },
        { id: 2, name: "Gói 300K", usd: 12 },
        { id: 3, name: "Gói 500K", usd: 20 },
      ];
      const selected = packages.find((p) => p.id === packageId);
      if (!selected)
        return res.status(400).json({ message: "Gói thanh toán không hợp lệ" });
      
      amountUSD = selected.usd;
      description = selected.name;
    } 
    // LOGIC 2: Thanh toán trực tiếp cho sản phẩm (nếu có productId)
    else if (productId) {
        // Ở đây bạn có thể query DB để lấy giá phí đăng tin, ví dụ fix cứng $2
        amountUSD = 2.00; 
        description = `Phí đăng tin cho sản phẩm #${productId}`;
    } else {
        return res.status(400).json({ message: "Thiếu thông tin thanh toán (packageId hoặc productId)" });
    }

    // Tạo đơn hàng PayPal
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amountUSD.toFixed(2),
          },
          description: description,
        },
      ],
      application_context: {
        // Lưu ý: Bạn có thể truyền query params vào return_url để xử lý logic ở frontend
        return_url: `${process.env.SERVER_URL}/api/payments/success`,
        cancel_url: `${process.env.SERVER_URL}/api/payments/cancel`,
      },
    });

    const order = await paypalClient.execute(request);

    // Lưu payment PENDING
    const payment = await Payment.create({
      member_id: memberId,
      amount: amountUSD,
      payment_method: "PAYPAL",
      payment_status: "PENDING",
      paypal_order_id: order.result.id,
      product_id: productId || null, // Lưu productId nếu là thanh toán cho bài đăng
    });

    await PaymentHistory.create({
      payment_id: payment.id,
      status: "INITIATED",
      note: `Khởi tạo giao dịch PayPal: ${description}`,
    });

    const approvalUrl = order.result.links.find((l) => l.rel === "approve").href;
    res.json({ approvalUrl });
  } catch (error) {
    console.error("PayPal Create Error:", error);
    res.status(500).json({ message: "Lỗi tạo thanh toán" });
  }
};

// ⚙️ [GET] /api/payments/success
exports.successPayment = async (req, res) => {
  let t;
  try {
    const { token } = req.query;

    // 1) Capture PayPal order
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});
    const capture = await paypalClient.execute(captureRequest);
    
    const orderId = capture.result.id;
    
    // [QUAN TRỌNG] Lấy Capture ID để dùng cho Refund sau này
    // Cấu trúc: result.purchase_units[0].payments.captures[0].id
    const captureId = capture.result.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    // 2) Transaction
    t = await sequelize.transaction();

    // 3) Tìm payment + lock
    const payment = await Payment.findOne({
      where: { paypal_order_id: orderId },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!payment) {
      await t.rollback();
      return res.status(404).json({ message: "Không tìm thấy giao dịch trong hệ thống" });
    }

    // 4) Idempotent check
    if (payment.payment_status === "COMPLETED") {
      await t.commit();
      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-success?status=already_processed`
      );
    }

    // 5) Cập nhật Payment COMPLETED và Lưu Capture ID
    payment.payment_status = "COMPLETED";
    payment.paypal_capture_id = captureId; // <--- Lưu lại để refund
    await payment.save({ transaction: t });

    await PaymentHistory.create(
      {
        payment_id: payment.id,
        status: "SUCCESS",
        note: "Thanh toán PayPal thành công",
      },
      { transaction: t }
    );

    // 6) Phân nhánh xử lý: Product hay Wallet
    if (payment.product_id) {
      // Nếu là thanh toán cho sản phẩm -> Update is_paid = true
      await Product.update(
        { is_paid: true },
        { where: { id: payment.product_id }, transaction: t }
      );
    } else {
      // Nếu là nạp tiền -> Cộng ví
      const member = await Member.findByPk(payment.member_id, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      member.wallet_balance = Number(member.wallet_balance) + Number(payment.amount);
      await member.save({ transaction: t });
    }

    await t.commit();

    // 7) Redirect về client
    res.redirect(
      `${process.env.CLIENT_URL || "http://localhost:3000"}/payment-success`
    );
  } catch (error) {
    if (t) await t.rollback();
    console.error("PayPal Capture Error:", error);
    res.status(500).json({ message: "Lỗi xác nhận giao dịch" });
  }
};

// ⚙️ [POST] /api/payments/refund-rejected (MỚI: Member yêu cầu hoàn tiền)
exports.requestRefundForRejectedProduct = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { productId } = req.body;
    const memberId = req.user.memberId; // Lấy từ token

    // 1. Kiểm tra xem Product có tồn tại và thuộc về Member này không
    const product = await Product.findOne({
      where: { id: productId, member_id: memberId },
      transaction: t,
    });

    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: "Sản phẩm không tồn tại hoặc không thuộc quyền sở hữu." });
    }

    // 2. Kiểm tra trạng thái phải là REJECTED
    if (product.status !== "REJECTED") {
      await t.rollback();
      return res.status(400).json({ message: "Chỉ được hoàn tiền cho sản phẩm bị Admin từ chối (REJECTED)." });
    }

    // 3. Tìm giao dịch thanh toán PayPal thành công của sản phẩm này
    const payment = await Payment.findOne({
      where: {
        product_id: productId,
        payment_status: "COMPLETED",
        payment_method: "PAYPAL",
      },
      lock: t.LOCK.UPDATE, // Khóa dòng này để tránh spam request
      transaction: t,
    });

    if (!payment) {
      await t.rollback();
      return res.status(400).json({ message: "Không tìm thấy giao dịch PayPal hợp lệ để hoàn tiền." });
    }

    if (!payment.paypal_capture_id) {
       await t.rollback();
       // Trường hợp dữ liệu cũ chưa lưu capture_id
       return res.status(400).json({ message: "Giao dịch này không đủ thông tin để hoàn tiền tự động. Vui lòng liên hệ CSKH." });
    }

    // 4. Gọi PayPal API để Refund
    // Lưu ý: Class này nằm trong namespace payments của paypal SDK
    const request = new paypal.payments.CapturesRefundRequest(payment.paypal_capture_id);
    request.requestBody({
      amount: {
        value: payment.amount, // Hoàn đúng số tiền đã trả
        currency_code: "USD"
      },
      note_to_payer: `Hoàn phí đăng tin cho sản phẩm #${product.id} (Bị từ chối duyệt).`
    });

    const refundResponse = await paypalClient.execute(request);

    // 5. Xử lý kết quả từ PayPal (Status 201 = Created/Success)
    if (refundResponse.statusCode === 201) {
      
      // Cập nhật Payment
      payment.payment_status = "REFUNDED";
      payment.refund_reason = "Member requested refund after Rejection";
      await payment.save({ transaction: t });

      // Lưu lịch sử
      await PaymentHistory.create({
        payment_id: payment.id,
        status: "SUCCESS",
        note: "Đã hoàn tiền thành công (Member request)",
      }, { transaction: t });

      // Cập nhật lại Product: is_paid = false (coi như chưa trả tiền vì đã hoàn lại)
      product.is_paid = false;
      await product.save({ transaction: t });

      await t.commit();
      return res.status(200).json({ message: "Yêu cầu hoàn tiền thành công! Tiền đã được hoàn về PayPal." });
    } else {
      throw new Error("PayPal API did not return 201 status.");
    }

  } catch (error) {
    await t.rollback();
    console.error("Refund Error:", error);
    // Lấy message lỗi chi tiết từ PayPal nếu có
    const msg = error.result ? JSON.parse(error.result).message : error.message;
    res.status(500).json({ message: "Lỗi xử lý hoàn tiền: " + msg });
  }
};

// ⚙️ [GET] /api/payments/cancel
exports.cancelPayment = async (req, res) => {
  res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/payment-cancel`);
};

// ⚙️ [GET] /api/payments/history
exports.getPaymentHistory = async (req, res) => {
  try {
    const histories = await Payment.findAll({
      where: { member_id: req.user.memberId },
      include: [{ model: PaymentHistory, as: "history" }],
      order: [["id", "DESC"]],
    });
    res.json(histories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tải lịch sử giao dịch" });
  }
};

// ⚙️ Helper: Trừ tiền ví (dùng nội bộ)
exports.deductBalance = async (memberId, amount, note = "Đăng tin") => {
  const member = await Member.findByPk(memberId);
  if (!member || Number(member.wallet_balance) < amount)
    throw new Error("Số dư không đủ");

  member.wallet_balance = Number(member.wallet_balance) - amount;
  await member.save();

  await PaymentHistory.create({
    payment_id: null,
    status: "SUCCESS",
    note,
  });

  return member.wallet_balance;
};

// ⚙️ [GET] /api/payments/admin/all
exports.getAllPaymentsForAdmin = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      // Sắp xếp mới nhất lên đầu
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "wallet_balance"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "full_name", "email", "phone", "avatar"],
            },
          ],
        },
        {
          model: Product,
          as: "product",
          attributes: ["id", "title", "price", "status"], // Chỉ lấy các trường cần thiết
        },
        {
          model: PaymentHistory,
          as: "history",
          attributes: ["status", "note", "created_at"], // Lấy lịch sử thay đổi trạng thái
        },
      ],
    });

    return res.status(200).json({
      message: "Lấy danh sách giao dịch thành công",
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    console.error("Get All Payments Error:", error);
    return res.status(500).json({ message: "Lỗi khi tải danh sách giao dịch cho Admin." });
  }
};