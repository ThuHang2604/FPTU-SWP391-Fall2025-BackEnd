module.exports = (sequelize, DataTypes) => {
  const Chatbox = sequelize.define("Chatbox", {
    // Composite Primary Key: (product_id, seller_id, buyer_id)
    product_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      primaryKey: true,
      comment: 'ID của sản phẩm đang chat'
    },
    seller_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      primaryKey: true,
      comment: 'ID của người bán (member_id của người đăng sản phẩm)'
    },
    buyer_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false,
      primaryKey: true,
      comment: 'ID của người mua (member_id của người nhấn "Nhắn tin")'
    },
  }, {
    tableName: "chatboxes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  });
  
  return Chatbox;
};
