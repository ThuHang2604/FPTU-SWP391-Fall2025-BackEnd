module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define("ChatMessage", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    chatbox_id: { type: DataTypes.BIGINT, allowNull: false },
    sender_id: { type: DataTypes.BIGINT, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
  }, {
    tableName: "chat_messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });
  return ChatMessage;
};
