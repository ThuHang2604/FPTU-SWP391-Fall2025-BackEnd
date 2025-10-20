const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const db = require("./src/models");

const PORT = process.env.PORT || 3000;

// ================= DATABASE SYNC =================
db.sequelize
  .sync() // ⚠️ Dùng sync() thôi, KHÔNG dùng alter:true để tránh deadlock
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ Database sync error:", err));

// ================= CREATE HTTP SERVER =================
const server = http.createServer(app);

// ================= SOCKET.IO SETUP =================
const io = new Server(server, {
  cors: {
    origin: "*", // hoặc thay bằng URL FE thật (VD: https://ev-swp391.vn)
  },
});

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log(`🟢 User connected: ${socket.id}`);

  // User tham gia phòng chat
  socket.on("joinChatbox", (chatboxId) => {
    socket.join(`chatbox_${chatboxId}`);
    console.log(`📦 User joined chatbox_${chatboxId}`);
  });

  // Nhận và gửi tin nhắn realtime
  socket.on("sendMessage", (data) => {
    console.log("💬 New message:", data);
    io.to(`chatbox_${data.chatbox_id}`).emit("newMessage", data);
  });

  // Ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`🔴 User disconnected: ${socket.id}`);
  });
});

// ================= START SERVER =================
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
