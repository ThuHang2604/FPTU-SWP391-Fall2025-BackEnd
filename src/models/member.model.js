module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: 'members',
      timestamps: false,
    }
  );

  return Member;
};
