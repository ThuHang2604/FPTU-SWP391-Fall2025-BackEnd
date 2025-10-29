// controllers/payment.controller.js
const paypal = require("@paypal/checkout-server-sdk");
const paypalClient = require("../config/paypal");
const { Payment, PaymentHistory, Member } = require("../models");

// ⚙️ [POST] /api/payments/create
exports.createPayment = async (req, res) => {
  try {
    const { packageId } = req.body;
    const memberId = req.user.memberId;

    const packages = [
      { id: 1, name: "Gói 100K", usd: 4 },
      { id: 2, name: "Gói 300K", usd: 12 },
      { id: 3, name: "Gói 500K", usd: 20 },
    ];
    const selected = packages.find((p) => p.id === packageId);
    if (!selected)
      return res.status(400).json({ message: "Gói thanh toán không hợp lệ" });

    // Tạo đơn hàng PayPal
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: selected.usd.toFixed(2),
          },
          description: selected.name,
        },
      ],
      application_context: {
        return_url: `${process.env.SERVER_URL}/api/payments/success`,
        cancel_url: `${process.env.SERVER_URL}/api/payments/cancel`,
      },
    });

    const order = await paypalClient.execute(request);

    const payment = await Payment.create({
      member_id: memberId,
      amount: selected.usd,
      payment_method: "PAYPAL",
      payment_status: "PENDING",
      paypal_order_id: order.result.id,
    });

    await PaymentHistory.create({
      payment_id: payment.id,
      status: "INITIATED",
      note: "Khởi tạo giao dịch PayPal",
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
  try {
    const { token } = req.query;
    const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
    captureRequest.requestBody({});
    const capture = await paypalClient.execute(captureRequest);

    const orderId = capture.result.id;
    const payment = await Payment.findOne({ where: { paypal_order_id: orderId } });
    if (!payment) return res.status(404).json({ message: "Không tìm thấy giao dịch" });

    payment.payment_status = "COMPLETED";
    await payment.save();

    await PaymentHistory.create({
      payment_id: payment.id,
      status: "SUCCESS",
      note: "Thanh toán PayPal thành công",
    });

    const member = await Member.findByPk(payment.member_id);
    member.wallet_balance = Number(member.wallet_balance) + Number(payment.amount);
    await member.save();

    res.redirect(`${process.env.CLIENT_URL || "http://localhost:3000"}/payment-success`);
  } catch (error) {
    console.error("PayPal Capture Error:", error);
    res.status(500).json({ message: "Lỗi xác nhận giao dịch" });
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

// ⚙️ Trừ tiền khi đăng tin
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
