'use strict';
let bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,255],
          msg: `Oh, you don\'t have a first name huh?`
        }
      }
    },
    lastname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Please give a valid email address 🤡 '
        }
    }    
  },
  gender: DataTypes.STRING,
  password:{
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [6, 32],
          msg: `Passwords must be between 6 and 32 characters`
        }
      }
    },
    bio: DataTypes.TEXT,
    username: DataTypes.STRING,
    birthday: DataTypes.DATE,
    admin: DataTypes.BOOLEAN,
    pic: DataTypes.STRING,
    zipcode: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: pendingUser => {
        // Hash the password
        let hashedPassword = bcrypt.hashSync(pendingUser.password, 12)

        // Reassign the hashed password (overwriting the plain text password)
        pendingUser.password = hashedPassword
      }
    }
  })
  
  user.associate = function(models) {
    // associations can be defined here
    models.user.hasMany(models.feed)
    models.user.hasMany(models.faves)
  };

  user.prototype.validPassword = function(typedInPassword) {
    // determine if the password typed in hashes to the same thing as the exisiting
    let correctPassword = bcrypt.compareSync(typedInPassword, this.password)
  
    // Return the (boolean) result of the comparison
    return correctPassword
  }

  return user;
};

