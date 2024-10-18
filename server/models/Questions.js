module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      questionId: {
        type: DataTypes.UUID, // UUID type for questionid
        defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID, // Foreign key of UUID type
        allowNull: false,
        references: {
          model: 'Users', // Use plural form for the Users table
          key: 'userId', // UUID key in the target model
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(50), // VARCHAR(50)
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200), // VARCHAR(200)
        allowNull: false,
      },
      imageLink: {
        type: DataTypes.STRING, // VARCHAR for imageLink
        allowNull: true, // This can be NULL
      },
      tag: {
        type: DataTypes.STRING(1000), // VARCHAR(1000) for tags
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE, // TIMESTAMP for created_at
        defaultValue: DataTypes.NOW, // Equivalent to DEFAULT CURRENT_TIMESTAMP
      },
      updatedAt: {
        type: DataTypes.DATE, // TIMESTAMP for updated_at
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW, // Automatically update on modification
      },
    }, {
      timestamps: true, // Sequelize will handle created_at and updated_at automatically
      tableName: 'questions', // Explicitly specifying the table name
    });
  
    // Associations
    Question.associate = (models) => {
      // Foreign key association with the 'User' model
      Question.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    };
  
    return Question;
  };
  