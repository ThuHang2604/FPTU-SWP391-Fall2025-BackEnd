module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define("ChatMessage", {
    id: { 
      type: DataTypes.BIGINT, 
      autoIncrement: true, 
      primaryKey: true 
    },
    // Composite foreign key to chatbox
    product_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      comment: 'FK: product_id của chatbox'
    },
    seller_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      comment: 'FK: seller_id của chatbox'
    },
    buyer_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      comment: 'FK: buyer_id của chatbox'
    },
    // Sender của message (có thể là seller hoặc buyer)
    sender_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      comment: 'ID của người gửi tin nhắn (seller_id hoặc buyer_id)'
    },
    message: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
  }, {
    tableName: "messages",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });
  return ChatMessage;
};
