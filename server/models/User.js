module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email already exists',
        },
        validate: {
          isEmail: {
            args: true,
            msg: 'Please provide a valid email',
          },
          async isUnique(value) {
            // Use a promise to check for existing emails
            const user = await User.findOne({ where: { email: value } });
            if (user) {
              throw new Error('Email already exists');
            }
          },
        },
      },
      gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
        validate: {
          isIn: {
            args: [['male', 'female']],
            msg: 'Gender must be either male or female',
          },
        },
      },
      country: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      agreed_to_terms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      role: {
        type: DataTypes.STRING(1),
        defaultValue: '0',
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      
    }, {
      timestamps: true,
    });
  
    return User;
  };
  
