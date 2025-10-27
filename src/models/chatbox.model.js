module.exports = (sequelize, DataTypes) => {
  const Chatbox = sequelize.define("Chatbox", {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    host_id: { type: DataTypes.BIGINT, allowNull: false },
  }, {
    tableName: "chatboxes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  });
  return Chatbox;
};
